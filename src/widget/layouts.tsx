import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

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

// A plain black circular 1x1 tile with a small band-coloured dot above the UV
// number — the dot is the only colour, the number stays white.
function Circle({ children }: { children: React.ReactNode }) {
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: BG,
        borderRadius: 1000,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 6,
      }}
    >
      {children}
    </FlexWidget>
  );
}

function Dot({ color }: { color: Hex }) {
  return (
    <FlexWidget
      style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color, marginBottom: 5 }}
    />
  );
}

export function Uv({ data }: WidgetProps) {
  if (!data) {
    return (
      <Circle>
        <Dot color={RING_TRACK} />
        <TextWidget text="—" style={{ color: DIM, fontSize: 34, fontFamily: FONT }} />
        <TextWidget
          text="UV"
          style={{ color: DIM, fontSize: 10, fontFamily: FONT, letterSpacing: 2 }}
        />
      </Circle>
    );
  }

  const level = uvLevel(data.forecast.currentUv);
  return (
    <Circle>
      <Dot color={level.color} />
      <TextWidget
        text={`${Math.round(data.forecast.currentUv)}`}
        style={{ color: WHITE, fontSize: 38, fontFamily: FONT }}
      />
      <TextWidget
        text="UV"
        style={{ color: DIM, fontSize: 10, fontFamily: FONT, letterSpacing: 2, marginTop: 1 }}
      />
    </Circle>
  );
}

// Maps each Android widget name (declared in app.json) to its layout.
export const widgetComponents: Record<string, React.FC<WidgetProps>> = {
  Uv,
};

export const widgetNames = Object.keys(widgetComponents);
