import { defineStore } from 'pinia'
import type { Earthquake } from '@/components/types/types.ts'
import { fetchEarthquakes } from '@/components/api/api.ts'

export const useEarthquakesStoreI = defineStore('earthquake', {
  state: () => ({
    is_loading: false,
    is_loaded: false,
    is_failed: false,
    on_loaded: [],

    significant_month: [] as Earthquake[],
    received_at: null,
  }),
  actions: {
    pushToLocalStorage() {
      try {
        sessionStorage.setItem(
          'earthquake',
          JSON.stringify({
            significant_month: this.significant_month,
            received_at: this.received_at,
          }),
        );
      } catch (e) {
        console.error(e);
      }
    },
    pullFromLocalStorage() {
      try {
        return JSON.parse(sessionStorage.getItem('earthquake'));
      } catch (e) {
        console.error(e);
      }
      return null;
    },
    async fetchData() {
      this.loadStart();
      let data;

      try {
          data = await fetchEarthquakes();
          data.received_at = Date.now();
          //оставить - нет?
      } catch (e) {
        console.error(e);
        this.loadFinished(false);
        return;
      }
      this.significant_month = data.features.map((item) => {
        return {
          id: item.id,
          place: item.properties.place,
          time: item.properties.time,
          magnitude: item.properties.mag,
          coordinates: item.geometry.coordinates.slice(0, 2),
          tsunami: item.properties.tsunami,
          hypocenter: item.geometry.coordinates[2],
        } as Earthquake
      });
      console.log('98',this.significant_month)
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
        callback(success);
      }
    },
  },
})

export const useEarthquakesStore= () => {
  const store = useEarthquakesStoreI();
  store.fetchData().then(() => console.log("Загрузка данных с сервера завершена"));
  console.log('1', store);
  return store;
};
