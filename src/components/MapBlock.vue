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
const currentEarthquakeId = ref<string | null>(null);

//Создание новых точек, используя данные с сервера
const renderedData = computed(() => {
  return store.earthquakes_array.map((earthquake) => {
    return new Feature({
      geometry: new Point(earthquake.coordinates),
      earthquake: earthquake
    });
  });
});

//Выбранная точка
const selectedFeature = computed(() => {
  if (!currentEarthquakeId.value || currentEarthquakeId.value === null) return null;
  return vectorSource.value
    .getFeatures()
    .find((feature) => feature.get('earthquake').id === currentEarthquakeId.value);
});

//Стили для точек
const styleCache = {};
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const styleFunction = function (feature) {
  const earthquake = feature.get('earthquake');
  const magnitude = earthquake.magnitude;
  const radius = 3 + (magnitude * 2) / 3;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    styleCache[radius] = style;
  }
  return style;
};

//Создание векторного слоя
const vectorSource = ref(new VectorSource());
const vectorLayer = new VectorLayer({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  source: vectorSource.value,
  style: styleFunction
});

//Загрузка растрового тайла
const rasterLayer = new TileLayer({
  source: new OGCMapTile({
    url: 'https://maps.gnosis.earth/ogcapi/collections/NaturalEarth:raster:HYP_HR_SR_OB_DR/map/tiles/WebMercatorQuad',
    crossOrigin: ''
  }),
  opacity: 1,
  zIndex: 0
});

useGeographic();

const overlay = ref(null);

//Первоначальная загрузка страницы
onMounted(() => {
  const map = new Map({
    target: 'map',
    layers: [rasterLayer, vectorLayer],
    view: new View({
      center: [0, 0],
      zoom: 2
    })
  });

  //Создание модального окна
  const popup = document.getElementById('popup');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  overlay.value = new Overlay({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    element: popup,
    positioning: 'bottom-center',
    offset: [0, -9]
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  map.addOverlay(overlay.value);

  //Слушатель на карту для модального окна
  map.on('click', function (evt) {
    const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      return feature;
    });
    if (!feature) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    overlay.value.setPosition(evt.coordinate);
    // console.log(evt.coordinate, Array.from(feature.get('earthquake').coordinates));
    currentEarthquake.value = feature.get('earthquake');
    if (currentEarthquake.value) {
      currentEarthquakeId.value = currentEarthquake.value.id;
      store.setCurrentEarthquake(currentEarthquake.value.id);
      // console.log(store.current_earthquake);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    popup.style.display = 'block';
  });

  //Изменение курсора для точки
  map.on('pointermove', function (event) {
    map.getViewport().style.cursor = map.hasFeatureAtPixel(event.pixel) ? 'pointer' : 'inherit';
  });
});

//Отслеживание получения новых данных с сервера
watch(
  renderedData,
  (newFeatures) => {
    vectorSource.value.clear();
    vectorSource.value.addFeatures(newFeatures);
  },
  { immediate: true }
);

//Открытие модального окна
const openPopup = (earthquake: Earthquake) => {
  if (earthquake) {
    currentEarthquake.value = earthquake;
    currentEarthquakeId.value = earthquake.id;
    const popup = document.getElementById('popup');
    const coordinates = earthquake.coordinates;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    overlay.value.setPosition(coordinates);
    if (popup) {
      popup.style.display = 'block';
    }
  }
};

//отслеживание и открытие модального попапа, если кликнут элемент в списке
watch(
  () => store.current_earthquake,
  (newId) => {
    const earthquake = store.earthquakes_array.find((eq) => eq.id === newId);

    if (earthquake) {
      openPopup(earthquake);
    }
  }
);

//Слушатель на изменение стиля точки при клике
watch(
  () => currentEarthquakeId.value,
  () => {
    updateStyle();
  }
);

//Изменение стиля точки при клике
const highlightStyle = function (feature: Feature) {
  const earthquake = feature.get('earthquake');
  const magnitude = earthquake.magnitude;
  const radius = 3 + 1.5 * (magnitude - 1);

  return new Style({
    image: new CircleStyle({
      radius: radius + 1,
      fill: new Fill({
        color: '#ad1457'
      })
    })
  });
};

function updateStyle() {
  vectorSource.value.getFeatures().forEach((feature) => {
    feature.setStyle(
      feature === selectedFeature.value ? highlightStyle(feature) : styleFunction(feature)
    );
  });
}

//Вычисления времени/координат/глубины/магнитуды/url
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

const calculatedMag = computed(() => {
  if (currentEarthquake.value) {
    return Math.round(currentEarthquake.value.magnitude * 10) / 10;
  }
  return 0;
});

const calculatedUrl = computed(() => {
  return currentEarthquake.value ? currentEarthquake.value.url : '';
});

//Закрытие попапа
const closePopup = () => {
  currentEarthquake.value = null;
  currentEarthquakeId.value = null;
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
            <a :href="calculatedUrl" target="_blank" class="map__popup-link">Show more</a>
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
                  currentEarthquake && calculatedMag
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

<style scoped lang="scss">
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 300px;
  width: calc(100% - 300px);
  background-color: #04041b;
}

.map {
  &__popup-header {
    display: flex;
    align-items: center;
    justify-content: end;
  }

  &__popup {
    background-color: #fff;
    border-radius: 4px;
    padding: 7px;
    position: relative;
    width: 270px;
    cursor: default;
  }

  &__content {
    padding-left: 5px;
    padding-right: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__close-btn {
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

  &__popup-title {
    font-family: 'Montserrat', sans-serif;
    margin-bottom: 0;
    font-size: 16px;
    font-weight: 500;
    line-height: normal;
    max-width: 220px;
  }

  &__icon {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    width: 18px;
    height: 18px;
  }

  &__icon-tsunami {
    background-image: url('@/components/icons/tsunami.svg');
  }

  &__icon-magnitude {
    background-image: url('@/components/icons/activity.svg');
  }

  &__icon-hypocenter {
    background-image: url('@/components/icons/depth.svg');
  }

  &__icon-earth {
    background-image: url('@/components/icons/globe.svg');
  }

  &__popup-date {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    font-weight: 400;
    line-height: 16px;
    text-align: left;
    color: #2c3e50;
    font-style: italic;
  }

  &__popup-table {
    display: table;
    width: auto;
  }

  &__popup-table-header {
    display: table-header-group;
  }

  &__popup-tr {
    display: table-row;
    margin-bottom: 0;
  }

  &__popup-table-body {
    display: table-row-group;
  }

  &__popup-th {
    display: table-cell;
    padding: 4px 10px;
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: normal;
    text-align: end;
  }

  &__popup-head {
    display: flex;
    flex-direction: column;
    align-items: start;
    margin-bottom: 20px;
    gap: 4px;
  }

  &__popup-link {
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: normal;
  }
}
</style>
