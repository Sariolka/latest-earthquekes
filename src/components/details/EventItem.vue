<script setup lang="ts">
import { computed } from 'vue';
import type { Earthquake } from '@/components/types/types.ts';
import MagnitudeItem from '@/components/details/MagnitudeItem.vue';
import { formatDate } from '@/components/helpers/dateFormatter.ts';
import { formatDepth } from '@/components/helpers/depthFormatter.ts';

const props = defineProps<{
  earthquake: Earthquake;
}>();

const calculatedMag = computed(() => {
  return Math.round(props.earthquake.magnitude * 10) / 10;
});

const calculatedDepth = computed(() => {
  return formatDepth(props.earthquake.hypocenter);
});

const calculatedTime = computed(() => {
  return formatDate(props.earthquake.time);
});
</script>

<template>
  <li class="event-item">
    <div class="event-item__top">
      <MagnitudeItem :magnitude="calculatedMag" />
      <h3 class="event-item__title">{{ earthquake.place }}</h3>
    </div>
    <div class="event-item__bottom">
      <p class="event-item__hypocenter">{{ calculatedDepth }} km</p>
      <p class="event-item__date">{{ calculatedTime }}</p>
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
  gap: 10px;
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

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  &__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-grow: 1;
    margin-bottom: 0;
  }

  &__hypocenter {
    margin-bottom: 0;
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
  }

  &__date {
    font-family: 'Montserrat', sans-serif;
    margin-bottom: 0;
    font-size: 13px;
    font-weight: 400;
    line-height: 16px;
    text-align: left;
    padding: 3px 6px;
    color: #2c3e50;
    font-style: italic;
  }
}
</style>
