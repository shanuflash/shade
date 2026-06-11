import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { SavedLocation } from '../api/types';
import type { Surroundings } from '../domain/tanning';

export type LocationMode = 'auto' | 'manual';
export type ThemePref = 'system' | 'light' | 'dark';

interface SettingsState {
  mode: LocationMode;
  /** City chosen via search, used when mode === 'manual'. */
  manualLocation: SavedLocation | null;
  /** Last auto-resolved location, cached for instant cold starts. */
  autoLocation: SavedLocation | null;
  themePref: ThemePref;
  /** What's around you, for the reflected-UV tanning adjustment. */
  surroundings: Surroundings;
  /** True once persisted state has been read from disk. */
  hydrated: boolean;

  useManualLocation: (loc: SavedLocation) => void;
  useAutoLocation: () => void;
  setAutoLocation: (loc: SavedLocation) => void;
  setThemePref: (pref: ThemePref) => void;
  setSurroundings: (s: Surroundings) => void;
  markHydrated: () => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      mode: 'auto',
      manualLocation: null,
      autoLocation: null,
      themePref: 'system',
      surroundings: 'open',
      hydrated: false,

      useManualLocation: (loc) => set({ mode: 'manual', manualLocation: loc }),
      useAutoLocation: () => set({ mode: 'auto' }),
      setAutoLocation: (loc) => set({ autoLocation: loc }),
      setThemePref: (pref) => set({ themePref: pref }),
      setSurroundings: (s) => set({ surroundings: s }),
      markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'shade.settings.v1',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => state?.markHydrated(),
      partialize: (s) => ({
        mode: s.mode,
        manualLocation: s.manualLocation,
        autoLocation: s.autoLocation,
        themePref: s.themePref,
        surroundings: s.surroundings,
      }),
    },
  ),
);

/** Resolve the location the app should currently fetch for. */
export function effectiveLocation(s: SettingsState): SavedLocation | null {
  if (s.mode === 'manual') return s.manualLocation;
  return s.autoLocation;
}
