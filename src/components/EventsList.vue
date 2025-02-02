<script setup lang="ts">
import { useEarthquakesStore } from '@/stores/earthquakesstore.ts'
import EventItem from '@/components/details/EventItem.vue'
import type { Earthquake } from '@/components/types/types.ts'
import { computed } from 'vue'
const store = useEarthquakesStore()
const filteredEarthquakes = computed(() => {
  return store.significant_month as Earthquake[]
});


</script>

<template>
  <ul class="events-list">
<EventItem v-for="earthquake in filteredEarthquakes" :key="earthquake.id" :earthquake="earthquake" />
  </ul>
</template>

<style scoped>
.events-list {
  display: flex;
  flex-direction: column;
  width: 300px;
  background-color: #2c3e50;
  position: absolute;
  min-height: 100vh;
  overflow-y: auto;
  padding: 20px 10px;
  list-style: none;
}
</style>
