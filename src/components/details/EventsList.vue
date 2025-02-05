<script setup lang="ts">
import EventItem from '@/components/details/EventItem.vue';
import type { Earthquake } from '@/components/types/types.ts';
import { useEarthquakesStore } from '@/stores/earthquakesstore.ts';

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
  height: 100vh;
  overflow-y: auto;
  list-style: none;
  scrollbar-gutter: stable;
}
</style>
