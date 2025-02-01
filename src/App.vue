<script setup lang="ts">
import MapBlock from '@/components/MapBlock.vue'
import EventsList from '@/components/EventsList.vue'
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
