import axios from 'axios';
import type { Earthquake } from '@/types/types.ts';

export const fetchEarthquakes = async (period: string, magnitude: string): Promise<any> => {
  try {
    const response = await axios.get(
      `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${magnitude}_${period}.geojson`
    );
    // console.log(response);
    return response.data as Earthquake[];
  } catch (error) {
    console.error('Fetching:', error);
  }
};
