import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Forecast, SavedLocation } from '../api/types';

const CACHE_KEY = 'shade.forecast.v1';

export interface CachedForecast {
  forecast: Forecast;
  location: SavedLocation;
  fetchedAt: number; // epoch ms
}

// The app, the widget's headless task, and the background task all read and
// write this cache, so it lives in AsyncStorage where every JS context can see it.
export async function writeForecastCache(
  forecast: Forecast,
  location: SavedLocation,
): Promise<void> {
  const payload: CachedForecast = { forecast, location, fetchedAt: Date.now() };
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload));
}

export async function readForecastCache(): Promise<CachedForecast | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as CachedForecast) : null;
  } catch {
    return null;
  }
}

export async function readLastLocation(): Promise<SavedLocation | null> {
  const cached = await readForecastCache();
  return cached?.location ?? null;
}
