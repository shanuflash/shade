import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Forecast, SavedLocation } from '../api/types';
import type { Surroundings } from '../domain/tanning';

const CACHE_KEY = 'shade.forecast.v1';
// Matches the zustand persist `name` in src/state/settingsStore.ts.
const SETTINGS_KEY = 'shade.settings.v1';

/** Forecast cache is considered stale (worth refetching) after this long. */
export const FORECAST_STALE_MS = 25 * 60 * 1000;

export interface CachedForecast {
  forecast: Forecast;
  location: SavedLocation;
  fetchedAt: number; // epoch ms
  /** Surroundings at write time, so the headless widget can adjust for tanning. */
  surroundings?: Surroundings;
}

// The app, the widget's headless task, and the background task all read and
// write this cache, so it lives in AsyncStorage where every JS context can see it.
export async function writeForecastCache(
  forecast: Forecast,
  location: SavedLocation,
): Promise<void> {
  const surroundings = await readSurroundings();
  const payload: CachedForecast = { forecast, location, fetchedAt: Date.now(), surroundings };
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload));
}

// Reads the surroundings preference straight from the persisted settings blob,
// so headless contexts (widget/background) can apply the tanning adjustment
// without the hydrated zustand store.
export async function readSurroundings(): Promise<Surroundings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return 'open';
    const parsed = JSON.parse(raw) as { state?: { surroundings?: Surroundings } };
    return parsed.state?.surroundings ?? 'open';
  } catch {
    return 'open';
  }
}

export async function readForecastCache(): Promise<CachedForecast | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as CachedForecast) : null;
  } catch {
    return null;
  }
}

/** True when there is no cache or it is older than the stale threshold. */
export function isCacheStale(cached: CachedForecast | null): boolean {
  if (!cached) return true;
  return Date.now() - cached.fetchedAt > FORECAST_STALE_MS;
}

// Reads the location the user last viewed without touching live GPS. The headless
// widget/background contexts can't rely on the hydrated zustand store, so we fall
// back to the raw persisted settings blob when the forecast cache is empty.
export async function readLastLocation(): Promise<SavedLocation | null> {
  const cached = await readForecastCache();
  if (cached?.location) return cached.location;
  return readPersistedLocation();
}

async function readPersistedLocation(): Promise<SavedLocation | null> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return null;
    // zustand persist wraps the partialized state under `state`.
    const parsed = JSON.parse(raw) as {
      state?: {
        mode?: 'auto' | 'manual';
        manualLocation?: SavedLocation | null;
        autoLocation?: SavedLocation | null;
      };
    };
    const s = parsed.state;
    if (!s) return null;
    const loc = s.mode === 'manual' ? s.manualLocation : s.autoLocation;
    return loc ?? s.autoLocation ?? s.manualLocation ?? null;
  } catch {
    return null;
  }
}
