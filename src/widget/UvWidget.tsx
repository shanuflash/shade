import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

import type { CachedForecast } from '../data/cache';
import { isSafeNow, uvLevel } from '../domain/uvLevels';

interface Props {
  data: CachedForecast | null;
}

const WHITE = '#FFFFFF';
const WHITE_DIM = '#E8EAF0';

/**
 * Compact, color-coded home-screen widget. Rendered both from live data
 * (background refresh) and from the shared cache (widget task handler).
 */
export function UvWidget({ data }: Props) {
  if (!data) {
    return (
      <FlexWidget
        clickAction="OPEN_APP"
        style={{
          height: 'match_parent',
          width: 'match_parent',
          backgroundColor: '#0B1120',
          borderRadius: 20,
          padding: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TextWidget text="Open Shade" style={{ color: WHITE, fontSize: 16, fontWeight: '700' }} />
        <TextWidget
          text="to load the UV index"
          style={{ color: WHITE_DIM, fontSize: 12, marginTop: 2 }}
        />
      </FlexWidget>
    );
  }

  const { forecast, location } = data;
  const level = uvLevel(forecast.currentUv);
  const safe = isSafeNow(forecast.currentUv);

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: level.colorDark,
        borderRadius: 20,
        padding: 14,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <FlexWidget
        style={{ flexDirection: 'row', width: 'match_parent', justifyContent: 'space-between' }}
      >
        <TextWidget
          text={location.label}
          style={{ color: WHITE, fontSize: 13, fontWeight: '600' }}
        />
        <TextWidget
          text={safe ? 'Safe now' : level.label}
          style={{ color: WHITE, fontSize: 12, fontWeight: '700' }}
        />
      </FlexWidget>

      <FlexWidget style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
        <TextWidget
          text={`${Math.round(forecast.currentUv)}`}
          style={{ color: WHITE, fontSize: 44, fontWeight: '800' }}
        />
        <TextWidget
          text="UV"
          style={{ color: WHITE_DIM, fontSize: 15, fontWeight: '700', marginBottom: 8, marginLeft: 4 }}
        />
      </FlexWidget>

      <FlexWidget style={{ flexDirection: 'column', width: 'match_parent' }}>
        <TextWidget text={level.shortTip} style={{ color: WHITE, fontSize: 13, fontWeight: '600' }} />
        <TextWidget
          text={`Today's max ${Math.round(forecast.todayMaxUv)}`}
          style={{ color: WHITE_DIM, fontSize: 12, marginTop: 2 }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
