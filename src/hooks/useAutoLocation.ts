import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';

import type { SavedLocation } from '../api/types';
import { useSettings } from '../state/settingsStore';

export type LocationStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'error';

function buildLabel(place: Location.LocationGeocodedAddress | undefined): string {
  if (!place) return 'Current location';
  // Prefer the sub-locality (e.g. "Poonamallee") over the broader city
  // ("Chennai"); fall back to ever-wider regions if it isn't available.
  return (
    place.district ||
    place.city ||
    place.subregion ||
    place.region ||
    place.country ||
    'Current location'
  );
}

// Resolves the device location into the settings store when in 'auto' mode,
// trying the cached last-known position before requesting a fresh fix.
export function useAutoLocation() {
  const mode = useSettings((s) => s.mode);
  const setAutoLocation = useSettings((s) => s.setAutoLocation);
  const [status, setStatus] = useState<LocationStatus>('idle');

  const resolve = useCallback(async () => {
    setStatus('loading');
    try {
      const { status: perm } = await Location.requestForegroundPermissionsAsync();
      if (perm !== 'granted') {
        setStatus('denied');
        return;
      }

      const position =
        (await Location.getLastKnownPositionAsync()) ??
        (await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }));

      const { latitude, longitude } = position.coords;

      let label = 'Current location';
      try {
        const places = await Location.reverseGeocodeAsync({ latitude, longitude });
        label = buildLabel(places[0]);
      } catch {
        // Reverse geocoding is best-effort; keep the default label.
      }

      const loc: SavedLocation = { latitude, longitude, label };
      setAutoLocation(loc);
      setStatus('granted');
    } catch {
      setStatus('error');
    }
  }, [setAutoLocation]);

  useEffect(() => {
    if (mode === 'auto') {
      void resolve();
    }
  }, [mode, resolve]);

  return { status, resolve };
}
