<script setup lang="ts">

import type { Earthquake } from '@/components/types/types.ts'
import { computed } from 'vue'

const props = defineProps<{
  earthquake: Earthquake
}>()

const calculatedMag = computed(() => {
  return Math.round(props.earthquake.magnitude * 10) / 10
})

const calculatedDepth = computed(() => {
  return Math.round(props.earthquake.hypocenter * 10) / 10
})

const calculatedTime = computed(() => {
  const date = new Date(props.earthquake.time);
  const hours = String(date.getUTCHours() + 3).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const timeZoneOffset = '+03:00';
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} (UTC${timeZoneOffset})`;
})
</script>

<template>
  <li class="event-item">
    <div class="event-item__top">
      <span class="event-item__magnitude">{{calculatedMag}}</span>
      <h3 class="event-item__title">{{earthquake.place}}</h3>
    </div>
    <div class="event-item__bottom">
      <p class="event-item__hypocenter">{{calculatedDepth}}</p>
      <p class="event-item__title">{{calculatedTime}}</p>
    </div>
  </li>
</template>

<style scoped lang="scss">
.event-item {
  display: flex;
  flex-direction: column;
  transition: background-color 0.2s;
  background-color: #fff;
  border-block-end: solid 1px #ebebeb;
  padding: 5px;
  list-style: none;
width: 100%;

  &:last-child {
    border: none;
    padding-bottom: 1px;
  }
  &:hover {
    background-color: #f1f8ff;
    cursor: pointer;
  }

  &__magnitude {
    display: inline-flex;
    padding: 3px;
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    font-weight: 600;
    background-color: rgba(198, 148, 213, 0.51);
    width: 30px;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
  }

  &__top{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  &__title{
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-grow: 1;
  }
}

</style>
