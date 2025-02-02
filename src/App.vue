<script setup lang="ts">
import MapBlock from '@/components/MapBlock.vue'
import EventsList from '@/components/EventsList.vue'
import { onMounted, ref } from 'vue'
import { fetchEarthquakes } from '@/components/api/api.ts'
import type { Earthquake } from '@/components/types/types.ts'

const earthquakesData = ref<Earthquake[]>([])

onMounted(async () => {
  earthquakesData.value = await fetchEarthquakes();
})
</script>

<template>
  <main class="main">
    <EventsList />
    <MapBlock :data="earthquakesData"/>
  </main>
</template>

<style scoped>
.main {
  display: flex;
  height: 100vh;
}
</style>
