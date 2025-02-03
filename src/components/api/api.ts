import axios from 'axios';
import type { Earthquake } from '@/components/types/types.ts';

export const fetchEarthquakes = async (): Promise<any> => {
  try {
    const response = await axios.get(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson'
    );
    console.log(response);
    return response.data as Earthquake[];
  } catch (error) {
    console.error('Fetching:', error);
  }
};
