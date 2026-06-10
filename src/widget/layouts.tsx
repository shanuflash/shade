// react-native-android-widget walks widget components as plain functions, so the
// React 19 compiler must not memoize them (per the library's guidance).
'use no memo';
import React from 'react';
import { FlexWidget, OverlapWidget, SvgWidget } from 'react-native-android-widget';

import type { CachedForecast } from '../data/cache';
import { uvLevel, type ProtectionAction } from '../domain/uvLevels';

export interface WidgetProps {
  data: CachedForecast | null;
}

type Hex = `#${string}`;

const BG: Hex = '#1B1B1B';
// Glyph colour for the empty state (no cached forecast yet).
const DIM: Hex = '#7D7D85';

// Inline SVG glyphs for each protection action, drawn on a 24x24 grid. The widget
// tells you what to *do* (the glyph) and how urgent it is (the glyph is tinted
// with the band colour) — the raw UV number lives in the app.
function actionSvg(action: ProtectionAction, color: Hex): string {
  // AndroidSVG (caverock) parses these via SVG.getFromString and needs the SVG
  // namespace declared, so keep the xmlns on the root element.
  const open = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">`;
  const body = {
    // Sun: clear, nothing to do.
    none: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6"/>',
    // Sunscreen bottle with a "+" mark.
    sunscreen:
      '<rect x="7.5" y="8" width="9" height="13" rx="2"/><path d="M10 8V5.5h4V8"/><rect x="9.5" y="2.5" width="5" height="3" rx="1"/><path d="M10 13.5h4M12 11.5v4"/>',
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
  const level = uvLevel(data.forecast.currentUv);
  return <Tile svg={actionSvg(level.action, level.color)} />;
}

// Maps each Android widget name (declared in app.json) to its layout.
export const widgetComponents: Record<string, React.FC<WidgetProps>> = {
  Uv,
};

export const widgetNames = Object.keys(widgetComponents);
