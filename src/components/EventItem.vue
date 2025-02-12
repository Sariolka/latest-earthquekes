<script setup lang="ts">
import { computed } from 'vue';
import { formatDate } from '@/helpers/dateFormatter.ts';
import { formatDepth } from '@/helpers/depthFormatter.ts';
import type { Earthquake } from '@/types/types.ts';
import MagnitudeItem from '@/components/MagnitudeItem.vue';

const props = defineProps<{
  earthquake: Earthquake;
  isActive: boolean;
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
  <li class="event-item" :class="{ 'event-item_active': isActive }" @click="$emit('click')">
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
@use '@/assets/constants';
@use '@/assets/mixins';

.event-item {
  display: flex;
  flex-direction: column;
  width: 280px;
  transition: background-color 0.2s;
  background-color: #fff;
  border-block-end: solid 1px #ebebeb;
  padding: 5px;
  gap: 10px;
  list-style: none;
  max-width: 100%;

  &_active {
    background: #e9f1f8;
    cursor: default;
    pointer-events: none;
  }

  &:last-child {
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
    @include mixins.base-typography(14px, normal, 600);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-grow: 1;
    margin-bottom: 0;
  }

  &__hypocenter {
    @include mixins.base-typography(13px, normal, 600);
    margin-bottom: 0;
    white-space: nowrap;
  }

  &__date {
    @include mixins.base-typography(13px, 16px, 400);
    margin-bottom: 0;
    text-align: left;
    padding: 3px 6px;
    color: #2c3e50;
    font-style: italic;
    white-space: nowrap;
  }
}
</style>
