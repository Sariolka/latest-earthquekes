<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Earthquake } from '@/types/types.ts';
import EventsList from '@/components/EventsList.vue';
import { useEarthquakesStore } from '@/stores/earthquakesstore.ts';
import PreloaderItem from '@/components/PreloaderItem.vue';

const store = useEarthquakesStore();
const isLoading = ref(false);
const inputValue = ref('');

const period = ref<'hour' | 'day' | 'week' | 'month'>('month');
const magnitude = ref<'all' | '1.0' | '2.5' | '4.5' | 'significant'>('significant');

//Данные из хранилища
const fetchedEarthquakes = computed(() => {
  return store.earthquakes_array as Earthquake[];
});

//Фильтрация списка по названию
const filteredEarthquakes = computed(() => {
  if (inputValue.value) {
    return fetchedEarthquakes.value.filter((earthquake) =>
      earthquake.place.toLowerCase().includes(inputValue.value.toLowerCase())
    );
  }
  return fetchedEarthquakes.value;
});

//Поиск по выбранным данным
const fetchData = async () => {
  if (isLoading.value) {
    return;
  }
  isLoading.value = true;
  try {
    await store.fetchData(period.value, magnitude.value);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="panel-block">
    <form class="panel-block__form" @submit.prevent="fetchData">
      <fieldset class="panel-block__control">
        <legend class="panel-block__title">Select Period:</legend>
        <label class="panel-block__radio">
          <input type="radio" name="period" value="hour" v-model="period" />
          Past Hour
        </label>
        <label class="panel-block__radio">
          <input type="radio" name="period" value="day" v-model="period" />
          Past Day
        </label>
        <label class="panel-block__radio">
          <input type="radio" name="period" value="week" v-model="period" />
          Past 7 Days
        </label>
        <label class="panel-block__radio">
          <input type="radio" name="period" value="month" v-model="period" />
          Past 30 Days
        </label>
      </fieldset>
      <fieldset class="panel-block__control">
        <legend class="panel-block__title">Select magnitude:</legend>
        <label class="panel-block__radio">
          <input type="radio" name="magnitude" value="all" v-model="magnitude" />
          All
        </label>
        <label class="panel-block__radio">
          <input type="radio" name="magnitude" value="1.0" v-model="magnitude" />
          ≥ 1.0
        </label>
        <label class="panel-block__radio">
          <input type="radio" name="magnitude" value="2.5" v-model="magnitude" />
          ≥ 2.5
        </label>
        <label class="panel-block__radio">
          <input type="radio" name="magnitude" value="4.5" v-model="magnitude" />
          ≥ 4.5
        </label>
        <label class="panel-block__radio">
          <input type="radio" name="magnitude" value="significant" v-model="magnitude" />
          Significant
        </label>
      </fieldset>
      <button class="button is-small panel-block__btn" type="submit">Search</button>
    </form>
    <input
      class="input is-small panel-block__input"
      type="text"
      placeholder="Filter..."
      v-model="inputValue"
    />
    <PreloaderItem v-if="isLoading" />
    <p class="panel-block__warning" v-if="!isLoading && !store.earthquakes_array.length">
      Nothing found
    </p>
    <EventsList
      :earthquakes="filteredEarthquakes"
      v-if="!isLoading && store.earthquakes_array.length"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/constants.scss';
@use '@/assets/mixins.scss';

.panel-block {
  display: flex;
  flex-direction: column;
  width: 300px;
  background-color: #2c3e50;
  position: absolute;
  height: 100vh;
  padding: 15px 0 15px 10px;

  &__control {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-bottom: 10px;
    gap: 3px 1px;

    &:last-of-type {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

  &__radio {
    @include mixins.base-typography(12px, normal, 400);
    color: #ebebeb;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__title {
    @include mixins.base-typography(16px, normal, 600);
    color: #fff;
    margin-bottom: 10px;
  }

  &__form {
    margin-bottom: 10px;
    width: calc(100% - 10px);
  }

  &__warning {
    @include mixins.base-typography(16px, normal, 400);
    color: #fff;
    margin-top: 100px;
    align-self: center;
  }

  &__input {
    @include mixins.base-typography(14px, normal, 400);
    margin-bottom: 10px;
    width: calc(100% - 10px);
    outline: transparent;
    border-color: #e9f1f8;

    &:focus {
      border-color: #e9f1f8;
    }
  }

  &__btn {
    width: 100%;
    outline: transparent;
  }
}
</style>
