<script setup lang="ts">
import TileLayer from 'ol/layer/Tile'
import { OGCMapTile } from 'ol/source'
import { Feature, View } from 'ol'
import Map from 'ol/Map.js'
import { computed, onMounted, ref, watch } from 'vue'
import { useGeographic } from 'ol/proj'
import { Point } from 'ol/geom'
import { Style } from 'ol/style'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { useEarthquakesStore } from '@/stores/earthquakesstore.ts'

const store = useEarthquakesStore()

const renderedData = computed(() => {
  return store.significant_month.map(earthquake => {
    return new Feature({
      geometry: new Point(earthquake.coordinates),
      id: earthquake.id,
      place: earthquake.place,
      magnitude: earthquake.magnitude,
    });
  });
});

const vectorSource = ref(new VectorSource());
const vectorLayer = new VectorLayer({
  source: vectorSource.value,
  style: {
    'circle-radius': 7,
    'circle-fill-color': 'red',
  },
})

const rasterLayer = new TileLayer({
  source: new OGCMapTile({
    url: 'https://maps.gnosis.earth/ogcapi/collections/NaturalEarth:raster:HYP_HR_SR_OB_DR/map/tiles/WebMercatorQuad',
    crossOrigin: '',
  }),
  opacity: 1,
  zIndex: 0,
})

useGeographic()

onMounted(() => {
  const map = new Map({
    target: 'map',
    layers: [rasterLayer, vectorLayer],
    view: new View({
      center: [0, 0],
      zoom: 2,
    }),
  })

  map.on('pointermove', function (event) {
    map.getViewport().style.cursor = map.hasFeatureAtPixel(event.pixel) ? 'pointer' : 'inherit'
  })
})
watch(renderedData, (newFeatures) => {
  vectorSource.value.clear();
  vectorSource.value.addFeatures(newFeatures);
}, { immediate: true });
</script>

<template>
  <div id="map" ref="mapContainer"></div>
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
</style>
