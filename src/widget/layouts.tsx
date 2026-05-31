import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

import type { CachedForecast } from '../data/cache';
import { isSafeNow, uvLevel } from '../domain/uvLevels';

export interface WidgetProps {
  data: CachedForecast | null;
}

const WHITE = '#FFFFFF';
const WHITE_DIM = '#E8EAF0';
const EMPTY_BG = '#0B1120';

function Empty({ radius }: { radius: number }) {
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: EMPTY_BG,
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

// 1x1: color-coded square with just the current UV number.
export function UvSmall({ data }: WidgetProps) {
  if (!data) return <Empty radius={18} />;
  const level = uvLevel(data.forecast.currentUv);
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: level.colorDark,
        borderRadius: 18,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
      }}
    >
      <TextWidget
        text={`${Math.round(data.forecast.currentUv)}`}
        style={{ color: WHITE, fontSize: 30, fontWeight: '800' }}
      />
      <TextWidget text="UV" style={{ color: WHITE_DIM, fontSize: 11, fontWeight: '700' }} />
    </FlexWidget>
  );
}

// 2x2: UV number, risk label, and today's max.
export function UvMedium({ data }: WidgetProps) {
  if (!data) return <Empty radius={20} />;
  const level = uvLevel(data.forecast.currentUv);
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: level.colorDark,
        borderRadius: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
      }}
    >
      <TextWidget
        text={`${Math.round(data.forecast.currentUv)}`}
        style={{ color: WHITE, fontSize: 48, fontWeight: '800' }}
      />
      <TextWidget text={level.label} style={{ color: WHITE, fontSize: 14, fontWeight: '700' }} />
      <TextWidget
        text={`Max ${Math.round(data.forecast.todayMaxUv)}`}
        style={{ color: WHITE_DIM, fontSize: 12, fontWeight: '600', marginTop: 2 }}
      />
    </FlexWidget>
  );
}

// 4x2: location, large UV number, risk label, protection tip, today's max.
export function UvLarge({ data }: WidgetProps) {
  if (!data) return <Empty radius={22} />;
  const level = uvLevel(data.forecast.currentUv);
  const safe = isSafeNow(data.forecast.currentUv);
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: level.colorDark,
        borderRadius: 22,
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 14,
      }}
    >
      <FlexWidget
        style={{ flexDirection: 'row', width: 'match_parent', justifyContent: 'space-between' }}
      >
        <TextWidget
          text={data.location.label}
          style={{ color: WHITE, fontSize: 13, fontWeight: '600' }}
        />
        <TextWidget
          text={safe ? 'Safe now' : level.label}
          style={{ color: WHITE, fontSize: 12, fontWeight: '700' }}
        />
      </FlexWidget>

      <FlexWidget style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
        <TextWidget
          text={`${Math.round(data.forecast.currentUv)}`}
          style={{ color: WHITE, fontSize: 44, fontWeight: '800' }}
        />
        <TextWidget
          text="UV"
          style={{
            color: WHITE_DIM,
            fontSize: 15,
            fontWeight: '700',
            marginBottom: 8,
            marginLeft: 4,
          }}
        />
      </FlexWidget>

      <FlexWidget style={{ flexDirection: 'column', width: 'match_parent' }}>
        <TextWidget text={level.shortTip} style={{ color: WHITE, fontSize: 13, fontWeight: '600' }} />
        <TextWidget
          text={`Today's max ${Math.round(data.forecast.todayMaxUv)}`}
          style={{ color: WHITE_DIM, fontSize: 12, marginTop: 2 }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}

// 4x1: thin strip with the UV number and a short tip on one line.
export function UvStrip({ data }: WidgetProps) {
  if (!data) return <Empty radius={18} />;
  const level = uvLevel(data.forecast.currentUv);
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: level.colorDark,
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
      }}
    >
      <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextWidget
          text={`${Math.round(data.forecast.currentUv)}`}
          style={{ color: WHITE, fontSize: 22, fontWeight: '800' }}
        />
        <TextWidget
          text="UV"
          style={{ color: WHITE_DIM, fontSize: 11, fontWeight: '700', marginLeft: 3 }}
        />
      </FlexWidget>
      <TextWidget
        text={level.shortTip}
        style={{ color: WHITE, fontSize: 12, fontWeight: '600' }}
      />
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
