import React from 'react';
import { FlexWidget, OverlapWidget, TextWidget } from 'react-native-android-widget';

import type { CachedForecast } from '../data/cache';
import { uvLevel } from '../domain/uvLevels';

export interface WidgetProps {
  data: CachedForecast | null;
}

type Hex = `#${string}`;

const BG: Hex = '#000000';
const RING_TRACK: Hex = '#1C1C20';
const WHITE: Hex = '#F4F4F6';
const DIM: Hex = '#7D7D85';
// Matches the TTF base name registered in the widget plugin's `fonts` list.
const FONT = 'SpaceGrotesk_700Bold';

// A plain black circular 1x1 tile. The UV number stays centred; the band-coloured
// dot is overlaid in the top-right corner so it never shifts the number.
function Tile({ dot, value, valueColor }: { dot: Hex; value: string; valueColor: Hex }) {
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
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TextWidget text={value} style={{ color: valueColor, fontSize: 38, fontFamily: FONT }} />
        <TextWidget
          text="UV"
          style={{ color: DIM, fontSize: 10, fontFamily: FONT, letterSpacing: 2, marginTop: 1 }}
        />
      </FlexWidget>

      <FlexWidget
        style={{
          height: 'match_parent',
          width: 'match_parent',
          justifyContent: 'flex-start',
          alignItems: 'flex-end',
        }}
      >
        <FlexWidget
          style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: dot, marginTop: 16, marginRight: 16 }}
        />
      </FlexWidget>
    </OverlapWidget>
  );
}

export function Uv({ data }: WidgetProps) {
  if (!data) {
    return <Tile dot={RING_TRACK} value="—" valueColor={DIM} />;
  }
  const level = uvLevel(data.forecast.currentUv);
  return <Tile dot={level.color} value={`${Math.round(data.forecast.currentUv)}`} valueColor={WHITE} />;
}

// Maps each Android widget name (declared in app.json) to its layout.
export const widgetComponents: Record<string, React.FC<WidgetProps>> = {
  Uv,
};

export const widgetNames = Object.keys(widgetComponents);
