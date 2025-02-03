<script setup lang="ts">
import TileLayer from 'ol/layer/Tile';
import { OGCMapTile } from 'ol/source';
import { Feature, Overlay, View } from 'ol';
import Map from 'ol/Map.js';
import { computed, onMounted, ref, watch } from 'vue';
import { useGeographic } from 'ol/proj';
import { Point } from 'ol/geom';
import { Fill, Stroke, Style } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { useEarthquakesStore } from '@/stores/earthquakesstore.ts';
import type { Earthquake } from '@/components/types/types.ts';
import { formatDate } from '@/components/helpers/dateFormatter.ts';
import { formatCoordinates } from '@/components/helpers/coordinatesFormatted.ts';
import { formatDepth } from '@/components/helpers/depthFormatter.ts';
import CircleStyle from 'ol/style/Circle';

const store = useEarthquakesStore();

const currentEarthquake = ref<Earthquake | null>(null);

const renderedData = computed(() => {
  return store.significant_month.map((earthquake) => {
    return new Feature({
      geometry: new Point(earthquake.coordinates),
      earthquake: earthquake
    });
  });
});
const styleCache = {};
const styleFunction = function (feature) {
  const earthquake = feature.get('earthquake');
  const magnitude = earthquake.magnitude;
  const radius = 3 + (magnitude - 1);
  let style = styleCache[radius];
  if (!style) {
    style = new Style({
      image: new CircleStyle({
        radius: radius,
        fill: new Fill({
          color: 'rgba(211, 40, 40, 0.6)'
        }),
        stroke: new Stroke({
          color: 'rgba(211, 40, 40, 0.3)',
          width: 1
        })
      })
    });
    styleCache[radius] = style;
  }
  return style;
};
const vectorSource = ref(new VectorSource());
const vectorLayer = new VectorLayer({
  source: vectorSource.value,
  style: styleFunction
});

const rasterLayer = new TileLayer({
  source: new OGCMapTile({
    url: 'https://maps.gnosis.earth/ogcapi/collections/NaturalEarth:raster:HYP_HR_SR_OB_DR/map/tiles/WebMercatorQuad',
    crossOrigin: ''
  }),
  opacity: 1,
  zIndex: 0
});

useGeographic();

onMounted(() => {
  const map = new Map({
    target: 'map',
    layers: [rasterLayer, vectorLayer],
    view: new View({
      center: [0, 0],
      zoom: 2
    })
  });

  const popup = document.getElementById('popup');
  const overlay = new Overlay({
    element: popup,
    positioning: 'bottom-center',
    offset: [0, -4]
  });
  map.addOverlay(overlay);

  map.on('click', function (evt) {
    const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      return feature;
    });
    if (!feature) {
      return;
    }
    overlay.setPosition(evt.coordinate);
    currentEarthquake.value = feature.get('earthquake');
    popup.style.display = 'block';
  });

  map.on('pointermove', function (event) {
    map.getViewport().style.cursor = map.hasFeatureAtPixel(event.pixel) ? 'pointer' : 'inherit';
  });
});

watch(
  renderedData,
  (newFeatures) => {
    vectorSource.value.clear();
    vectorSource.value.addFeatures(newFeatures);
  },
  { immediate: true }
);

const calculatedTime = computed(() => {
  if (currentEarthquake.value) {
    return formatDate(currentEarthquake.value.time);
  }
  return 0;
});
const calculatedCoordinates = computed(() => {
  if (currentEarthquake.value) {
    return formatCoordinates(currentEarthquake.value.coordinates);
  }
  return 0;
});

const calculatedDepth = computed(() => {
  if (currentEarthquake.value) {
    return formatDepth(currentEarthquake.value.hypocenter);
  }
  return 0;
});

const closePopup = () => {
  currentEarthquake.value = null;
  const popup = document.getElementById('popup');
  if (popup) {
    popup.style.display = 'none';
  }
};
</script>

<template>
  <div id="map" ref="mapContainer" class="map">
    <div style="display: none" class="map__overlay">
      <div id="popup" class="map__popup">
        <div class="map__popup-header">
          <button class="map__close-btn" aria-label="close" @click="closePopup"></button>
        </div>
        <div class="map__content">
          <div class="map__popup-head">
            <h4 id="title" class="map__popup-title">
              {{ currentEarthquake && currentEarthquake.place }}
            </h4>
            <p class="map__popup-date">{{ calculatedTime }}</p>
          </div>

          <div class="map__popup-table">
            <div class="map__popup-table-header">
              <p class="map__popup-tr">
                <span
                  class="map__popup-th map__icon map__icon-magnitude"
                  v-if="currentEarthquake"
                  title="magnitude"
                ></span>
                <span
                  class="map__popup-th map__icon map__icon-hypocenter"
                  v-if="currentEarthquake"
                  title="depth"
                ></span>
                <span
                  class="map__popup-th map__icon map__icon-tsunami"
                  v-if="currentEarthquake"
                  title="tsunami"
                ></span>
                <span
                  class="map__popup-th map__icon map__icon-earth"
                  v-if="currentEarthquake"
                  title="coordinates"
                ></span>
              </p>
            </div>
            <div class="map__popup-table-body">
              <p class="map__popup-tr">
                <span class="map__popup-th map__popup-magnitude">{{
                  currentEarthquake && currentEarthquake.magnitude
                }}</span>
                <span class="map__popup-th map__popup-hypocenter"
                  >{{ currentEarthquake && calculatedDepth }}&nbsp;km</span
                >
                <span class="map__popup-th map__popup-tsunami">{{
                  currentEarthquake && currentEarthquake.tsunami
                }}</span>
                <span class="map__popup-th map__popup-coordinates">{{
                  calculatedCoordinates
                }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 300px;
  width: calc(100% - 300px);
  background-color: #04041b;
}

.map__popup-header {
  display: flex;
  align-items: center;
  justify-content: end;
}
.map__popup {
  background-color: #fff;
  border-radius: 4px;
  padding: 7px;
  position: relative;
  width: 270px;
  cursor: default;
}

.map__content {
  padding-left: 5px;
  padding-right: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.map__close-btn {
  background-image: url('@/components/icons/close.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
  border: none;
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.map__popup-title {
  font-family: 'Montserrat', sans-serif;
  margin-bottom: 0;
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
  max-width: 220px;
}

.map__icon {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 18px;
  height: 18px;
}

.map__icon-tsunami {
  background-image: url('@/components/icons/tsunami.svg');
}

.map__icon-magnitude {
  background-image: url('@/components/icons/activity.svg');
}

.map__icon-hypocenter {
  background-image: url('@/components/icons/depth.svg');
}

.map__icon-earth {
  background-image: url('@/components/icons/globe.svg');
}

.map__popup-date {
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
  text-align: left;
  color: #2c3e50;
  font-style: italic;
  margin-bottom: 20px;
}

.map__popup-table {
  display: table;
  width: auto;
}

.map__popup-table-header {
  display: table-header-group;
}

.map__popup-tr {
  display: table-row;
  margin-bottom: 0;
}

.map__popup-table-body {
  display: table-row-group;
}

.map__popup-th {
  display: table-cell;
  padding: 4px 10px;
  text-align: left;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
}

.map__popup-head {
  display: flex;
  flex-direction: column;
  align-items: start;
}

</style>
