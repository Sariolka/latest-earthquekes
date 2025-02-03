<script setup lang="ts">
import MapBlock from '@/components/MapBlock.vue';
import EventsList from '@/components/EventsList.vue';
import { onMounted, ref } from 'vue';
import { fetchEarthquakes } from '@/components/api/api.ts';
import type { Earthquake } from '@/components/types/types.ts';
</script>

<template>
  <main class="main">
    <EventsList />
    <MapBlock />
  </main>
</template>

<style scoped>
.main {
  display: flex;
  height: 100vh;
}
</style>
