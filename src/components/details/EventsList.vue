<script setup lang="ts">
import { useEarthquakesStore } from '@/stores/earthquakesstore.ts';
import EventItem from '@/components/details/EventItem.vue';
import type { Earthquake } from '@/components/types/types.ts';
import { computed, watch } from 'vue';
const store = useEarthquakesStore();
const filteredEarthquakes = computed(() => {
  return store.earthquakes_array as Earthquake[];
});

watch(
  () => store.earthquakes_array,
  () => {}
);
const selectEarthquake = (id: string) => {
  store.setCurrentEarthquake(id);
};
</script>

<template>
  <ul class="events-list">
    <EventItem
      v-for="earthquake in filteredEarthquakes"
      :key="earthquake.id"
      :earthquake="earthquake"
      :is-active="store.current_earthquake === earthquake.id"
      @click="selectEarthquake(earthquake.id)"
    />
  </ul>
</template>

<style scoped>
.events-list {
  display: flex;
  flex-direction: column;
  //width: 300px;
  //background-color: #2c3e50;
  border-radius: 4px;
  height: 100vh;
  overflow-y: auto;
  //padding: 20px 0 20px 10px;
  list-style: none;
  scrollbar-gutter: stable;
}
</style>
