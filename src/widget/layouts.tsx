import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

import type { CachedForecast } from '../data/cache';
import { isSafeNow, uvLevel } from '../domain/uvLevels';

export interface WidgetProps {
  data: CachedForecast | null;
}

const BG = '#151517';
const WHITE = '#F4F4F5';
const DIM = '#9B9BA1';
const DOT_EMPTY = '#34343A';
// Matches the file base name registered in the widget plugin's `fonts` list.
const DOT_FONT = 'Ndot55-Regular';

type Hex = `#${string}`;

function Dots({ filled, color, size = 6 }: { filled: number; color: Hex; size?: number }) {
  return (
    <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <FlexWidget
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: i < filled ? color : DOT_EMPTY,
            marginRight: i < 4 ? 4 : 0,
          }}
        />
      ))}
    </FlexWidget>
  );
}

function Empty({ radius }: { radius: number }) {
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: BG,
        borderRadius: radius,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 6,
      }}
    >
      <TextWidget text="Open Shade" style={{ color: WHITE, fontSize: 13, fontWeight: '700' }} />
    </FlexWidget>
  );
}

// 1x1: round black tile, white UV number with a single risk-colored dot above.
export function UvSmall({ data }: WidgetProps) {
  if (!data) return <Empty radius={60} />;
  const level = uvLevel(data.forecast.currentUv);
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: BG,
        borderRadius: 60,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
      }}
    >
      <FlexWidget
        style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: level.color, marginBottom: 5 }}
      />
      <TextWidget
        text={`${Math.round(data.forecast.currentUv)}`}
        style={{ color: WHITE, fontSize: 40, fontFamily: DOT_FONT }}
      />
      <TextWidget
        text="UV"
        style={{ color: DIM, fontSize: 10, fontWeight: '700', letterSpacing: 1, marginTop: 1 }}
      />
    </FlexWidget>
  );
}

// 2x2: UV number, risk label, and dot indicator.
export function UvMedium({ data }: WidgetProps) {
  if (!data) return <Empty radius={26} />;
  const level = uvLevel(data.forecast.currentUv);
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: BG,
        borderRadius: 26,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
      }}
    >
      <TextWidget
        text={`${Math.round(data.forecast.currentUv)}`}
        style={{ color: WHITE, fontSize: 54, fontFamily: DOT_FONT }}
      />
      <TextWidget
        text={level.label}
        style={{ color: WHITE, fontSize: 13, fontWeight: '700', marginBottom: 8 }}
      />
      <Dots filled={level.index + 1} color={level.color} size={7} />
    </FlexWidget>
  );
}

// 4x2: location, large UV number, dot indicator, protection tip, today's max.
export function UvLarge({ data }: WidgetProps) {
  if (!data) return <Empty radius={28} />;
  const level = uvLevel(data.forecast.currentUv);
  const safe = isSafeNow(data.forecast.currentUv);
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: BG,
        borderRadius: 28,
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 16,
      }}
    >
      <FlexWidget
        style={{ flexDirection: 'row', width: 'match_parent', justifyContent: 'space-between' }}
      >
        <TextWidget text={data.location.label} style={{ color: DIM, fontSize: 13, fontWeight: '600' }} />
        <TextWidget
          text={safe ? 'Safe now' : level.label}
          style={{ color: WHITE, fontSize: 12, fontWeight: '700' }}
        />
      </FlexWidget>

      <FlexWidget style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
        <TextWidget
          text={`${Math.round(data.forecast.currentUv)}`}
          style={{ color: WHITE, fontSize: 54, fontFamily: DOT_FONT }}
        />
        <TextWidget
          text="UV"
          style={{ color: DIM, fontSize: 15, fontWeight: '700', marginBottom: 9, marginLeft: 5 }}
        />
        <FlexWidget style={{ marginBottom: 14, marginLeft: 12 }}>
          <Dots filled={level.index + 1} color={level.color} size={7} />
        </FlexWidget>
      </FlexWidget>

      <FlexWidget style={{ flexDirection: 'column', width: 'match_parent' }}>
        <TextWidget text={level.shortTip} style={{ color: WHITE, fontSize: 13, fontWeight: '600' }} />
        <TextWidget
          text={`Today's max ${Math.round(data.forecast.todayMaxUv)}`}
          style={{ color: DIM, fontSize: 12, marginTop: 2 }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}

// 4x1: UV number, dot indicator, and a short tip on one line.
export function UvStrip({ data }: WidgetProps) {
  if (!data) return <Empty radius={24} />;
  const level = uvLevel(data.forecast.currentUv);
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: BG,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
      }}
    >
      <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextWidget
          text={`${Math.round(data.forecast.currentUv)}`}
          style={{ color: WHITE, fontSize: 28, fontFamily: DOT_FONT }}
        />
        <TextWidget text="UV" style={{ color: DIM, fontSize: 11, fontWeight: '700', marginLeft: 4 }} />
        <FlexWidget style={{ marginLeft: 10 }}>
          <Dots filled={level.index + 1} color={level.color} size={6} />
        </FlexWidget>
      </FlexWidget>
      <TextWidget text={level.shortTip} style={{ color: WHITE, fontSize: 12, fontWeight: '600' }} />
    </FlexWidget>
  );
}

// Maps each Android widget name (declared in app.json) to its layout.
export const widgetComponents: Record<string, React.FC<WidgetProps>> = {
  UvSmall,
  UvMedium,
  UvLarge,
  UvStrip,
};

export const widgetNames = Object.keys(widgetComponents);
