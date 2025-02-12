<script setup lang="ts">
import MapBlock from '@/components/MapBlock.vue';
import PanelBlock from '@/components/PanelBlock.vue';
</script>

<template>
  <main class="main">
    <PanelBlock />
    <MapBlock />
  </main>
</template>

<style scoped>
.main {
  display: flex;
  height: 100vh;
}
</style>
