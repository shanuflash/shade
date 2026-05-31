import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

import type { CachedForecast } from '../data/cache';
import { uvLevel } from '../domain/uvLevels';

interface Props {
  data: CachedForecast | null;
}

const WHITE = '#FFFFFF';
const WHITE_DIM = '#E8EAF0';

/**
 * Compact 1x1 home-screen widget: a color-coded square showing the current UV
 * index. The background color is the risk band, so it's glanceable at a tiny
 * size. Tapping opens the app for full details.
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
          borderRadius: 18,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TextWidget text="UV" style={{ color: WHITE, fontSize: 16, fontWeight: '800' }} />
        <TextWidget text="—" style={{ color: WHITE_DIM, fontSize: 20, fontWeight: '700' }} />
      </FlexWidget>
    );
  }

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
      <TextWidget
        text="UV"
        style={{ color: WHITE_DIM, fontSize: 11, fontWeight: '700' }}
      />
    </FlexWidget>
  );
}
