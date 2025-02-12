<script setup lang="ts">
import { useEarthquakesStore } from '@/stores/earthquakesstore.ts';
import EventItem from '@/components/EventItem.vue';
import type { Earthquake } from '@/types/types.ts';

const props = defineProps<{
  earthquakes: Earthquake[];
}>();

const store = useEarthquakesStore();

const selectEarthquake = (id: string) => {
  store.setCurrentEarthquake(id);
};
</script>

<template>
  <ul class="events-list">
    <EventItem
      v-for="earthquake in earthquakes"
      :key="earthquake.id"
      :earthquake="earthquake"
      :is-active="store.current_earthquake === earthquake.id"
      @click="selectEarthquake(earthquake.id)"
      :data-id="earthquake.id"
    />
  </ul>
</template>

<style scoped lang="scss">
.events-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  list-style: none;
  width: 100%;
  scrollbar-gutter: stable;
}
</style>
