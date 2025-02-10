<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  magnitude: number;
}>();

const magnitudeClasses = computed(() => {
  const prefix = 'magnitude';
  return [
    prefix,
    {
      [`${prefix}_type-3`]: props.magnitude <= 3,
      [`${prefix}_type-5`]: props.magnitude <= 5 && props.magnitude > 3,
      [`${prefix}_type-6`]: props.magnitude <= 6 && props.magnitude > 5,
      [`${prefix}_type-7`]: props.magnitude <= 7 && props.magnitude > 6,
      [`${prefix}_type-8`]: props.magnitude <= 9 && props.magnitude > 7
    }
  ];
});
</script>

<template>
  <span :class="magnitudeClasses" class="magnitude">{{ magnitude }}</span>
</template>

<style scoped lang="scss">
@use '@/assets/constants.scss';
@use '@/assets/mixins.scss';

.magnitude {
  @include mixins.base-typography(14px, normal, 600);
  display: inline-flex;
  padding: 3px;
  background-color: rgba(255, 238, 235, 0.7);
  width: 32px;
  min-width: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 40px;

  &_type-3 {
    background-color: rgba(255, 238, 235, 0.7);
  }

  &_type-5 {
    background-color: rgba(255, 210, 205, 0.7);
  }

  &_type-6 {
    background-color: rgba(239, 154, 154, 0.7);
  }

  &_type-7 {
    background-color: rgba(229, 115, 115, 0.7);
  }

  &_type-8 {
    background-color: rgba(239, 80, 83, 0.7);
  }
}
</style>
