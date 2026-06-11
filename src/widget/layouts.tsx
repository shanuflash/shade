// react-native-android-widget walks widget components as plain functions, so the
// React 19 compiler must not memoize them (per the library's guidance).
'use no memo';
import React from 'react';
import { FlexWidget, OverlapWidget, SvgWidget } from 'react-native-android-widget';

import type { CachedForecast } from '../data/cache';
import { effectiveUv } from '../domain/tanning';
import { uvLevel, type ProtectionAction } from '../domain/uvLevels';

export interface WidgetProps {
  data: CachedForecast | null;
}

type Hex = `#${string}`;

const BG: Hex = '#1B1B1B';
// Glyphs are a single flat colour: white normally, dim for the empty state.
const WHITE: Hex = '#F4F4F6';
const DIM: Hex = '#7D7D85';

// Inline SVG glyphs for each protection action, drawn on a 24x24 grid as a single
// flat-colour stroke. The widget tells you what to *do* (which glyph) — severity
// is conveyed by the action ladder itself, not colour. The UV number lives in app.
function actionSvg(action: ProtectionAction, color: Hex): string {
  // AndroidSVG (caverock) parses these via SVG.getFromString and needs the SVG
  // namespace declared, so keep the xmlns on the root element.
  const open = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">`;
  const body = {
    // Sun: clear, nothing to do.
    none: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6"/>',
    // Sunscreen bottle: cap, short neck, rounded body with a "+" dose mark.
    sunscreen:
      '<rect x="9.5" y="2.5" width="5" height="3" rx="1"/><path d="M10.2 5.5v2M13.8 5.5v2"/><rect x="6.8" y="7.5" width="10.4" height="13.5" rx="3"/><path d="M12 11.8v5M9.5 14.3h5"/>',
    // UPF jacket: long sleeves hanging down, V-collar, centre zip with a pull.
    jacket:
      '<path d="M9 3.5 5 5.5 3 15 5.5 16 7 9 7 20.5 17 20.5 17 9 18.5 16 21 15 19 5.5 15 3.5 12 6.5Z"/><path d="M12 6.5V20.5"/><circle cx="12" cy="9.2" r="0.9"/>',
    // Umbrella: stay in the shade.
    shade:
      '<path d="M3 11a9 8 0 0 1 18 0Z"/><path d="M12 3v8M12 11v6.5a2 2 0 0 0 4 0"/>',
  }[action];
  return `${open}${body}</svg>`;
}

// A plain circular 1x1 tile with the action glyph centred. The glyph carries both
// the action (its shape) and the urgency (its band colour), so no extra indicator
// is needed.
function Tile({ svg }: { svg: string }) {
  return (
    <OverlapWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: BG,
        borderRadius: 1000,
      }}
    >
      <FlexWidget
        style={{
          height: 'match_parent',
          width: 'match_parent',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <SvgWidget svg={svg} style={{ width: 48, height: 48 }} />
      </FlexWidget>
    </OverlapWidget>
  );
}

export function Uv({ data }: WidgetProps) {
  if (!data) {
    return <Tile svg={actionSvg('none', DIM)} />;
  }
  // Match the app: the glyph reflects the effective tanning load (raw UV adjusted
  // for altitude and reflective surroundings), not the bare index.
  const eff = effectiveUv(data.forecast.currentUv, data.forecast.elevation, data.surroundings ?? 'open');
  const level = uvLevel(eff);
  return <Tile svg={actionSvg(level.action, WHITE)} />;
}

// Maps each Android widget name (declared in app.json) to its layout.
export const widgetComponents: Record<string, React.FC<WidgetProps>> = {
  Uv,
};

export const widgetNames = Object.keys(widgetComponents);
