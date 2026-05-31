import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Forecast, SavedLocation } from '../api/types';

const CACHE_KEY = 'shade.forecast.v1';

export interface CachedForecast {
  forecast: Forecast;
  location: SavedLocation;
  fetchedAt: number; // epoch ms
}

/**
 * Single source of truth shared between the app, the home-screen widget's
 * headless task, and the background refresh task. Backed by AsyncStorage so it
 * is readable from every JS context.
 */
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

/** Last location we successfully fetched for — used by the background task. */
export async function readLastLocation(): Promise<SavedLocation | null> {
  const cached = await readForecastCache();
  return cached?.location ?? null;
}
