import { useColorScheme } from 'react-native';

import { useSettings } from '../state/settingsStore';
import { darkPalette, lightPalette, type Palette } from './colors';

export interface Theme {
  isDark: boolean;
  colors: Palette;
}

/** Resolve the active palette from the user preference + system scheme. */
export function useTheme(): Theme {
  const system = useColorScheme();
  const pref = useSettings((s) => s.themePref);

  const isDark = pref === 'system' ? system !== 'light' : pref === 'dark';
  return { isDark, colors: isDark ? darkPalette : lightPalette };
}
