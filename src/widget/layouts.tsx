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

// A perfectly round 1x1 tile: a band-coloured ring (a coloured circle showing
// through the padding) around a black inner circle with the UV number.
function Circle({ ring, children }: { ring: Hex; children: React.ReactNode }) {
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: ring,
        borderRadius: 1000,
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <FlexWidget
        style={{
          height: 'match_parent',
          width: 'match_parent',
          backgroundColor: BG,
          borderRadius: 1000,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {children}
      </FlexWidget>
    </FlexWidget>
  );
}

export function Uv({ data }: WidgetProps) {
  if (!data) {
    return (
      <Circle ring={RING_TRACK}>
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
    <Circle ring={level.color}>
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
