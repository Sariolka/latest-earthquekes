import { defineStore } from 'pinia';
import type { Earthquake } from '@/components/types/types.ts';
import { fetchEarthquakes } from '@/components/api/api.ts';

const CACHE_TIME = 120;

export const useEarthquakesStoreI = defineStore('earthquake', {
  state: () => ({
    is_loading: false,
    is_loaded: false,
    is_failed: false,
    on_loaded: [],

    earthquakes_array: [] as Earthquake[],
    received_at: null,
    current_earthquake: ''
  }),
  actions: {
    pushToLocalStorage() {
      try {
        sessionStorage.setItem(
          'earthquake',
          JSON.stringify({
            earthquakes_array: this.earthquakes_array,
            received_at: this.received_at
          })
        );
      } catch (e) {
        console.error(e);
      }
    },
    pullFromLocalStorage() {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return JSON.parse(sessionStorage.getItem('earthquake'));
      } catch (e) {
        console.error(e);
      }
      return null;
    },
    setCurrentEarthquake(id: string) {
      this.current_earthquake = id;
    },
    async fetchData(period: string, magnitude: string) {
      this.loadStart();
      let data;

      try {
        data = this.pullFromLocalStorage();
        if (!data?.received_at || data.received_at + CACHE_TIME < Date.now()) {
          data = await fetchEarthquakes(period, magnitude);
          data.received_at = Date.now();
        }
      } catch (e) {
        console.error(e);
        this.loadFinished(false);
        return;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      this.earthquakes_array = data.features.map((item) => {
        return {
          id: item.id,
          place: item.properties.place,
          time: item.properties.time,
          magnitude: item.properties.mag,
          coordinates: item.geometry.coordinates.slice(0, 2),
          tsunami: item.properties.tsunami,
          hypocenter: item.geometry.coordinates[2],
          url: item.properties.url
        } as Earthquake;
      });
      this.pushToLocalStorage();
      this.loadFinished(true);
    },

    loadStart() {
      this.is_loading = true;
      this.on_loaded = [];
    },

    loadFinished(success: boolean) {
      this.is_loading = false;
      this.is_loaded = true;
      this.is_failed = !success;

      for (const callback of this.on_loaded) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        callback(success);
      }
    }
  },
  getters: {
    isNeedLoading: (state) => () => {
      return !state.is_loading && !state.is_loaded;
    }
  }
});

export const useEarthquakesStore = () => {
  const store = useEarthquakesStoreI();
  if (store.isNeedLoading()) {
    store
      .fetchData('month', 'significant')
      .then(() => console.log('Загрузка данных с сервера завершена'));
    // console.log('1', store);
  }
  return store;
};
