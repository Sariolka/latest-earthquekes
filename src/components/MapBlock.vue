<script setup lang="ts">
import TileLayer from 'ol/layer/Tile'
import { OGCMapTile, OGCVectorTile, OSM, XYZ } from 'ol/source'
import { Feature, View } from 'ol'
import Map from 'ol/Map.js'
import { onMounted, ref } from 'vue'
import { useGeographic } from 'ol/proj'
import { Point } from 'ol/geom'
import { Style } from 'ol/style'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { GeoJSON, MVT } from 'ol/format'
import VectorTileLayer from 'ol/layer/VectorTile'

const mapContainer = ref()

const place = [-151.0385, 61.3746]

const point = new Feature({
  geometry: new Point(place),
})

const vectorSource = new VectorSource({
  features: [point],
})

const vectorLayer = new VectorLayer({
  source: vectorSource,
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
    const type = map.hasFeatureAtPixel(event.pixel) ? 'pointer' : 'inherit'
    map.getViewport().style.cursor = type
  })
})
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
}
</style>
