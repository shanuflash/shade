import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';

import type { HourlyPoint } from '../api/types';
import { useTheme } from '../theme/useTheme';
import { fonts } from '../theme/fonts';
import { font } from '../theme/tokens';
import { parseLocal } from '../utils/time';

interface Props {
  hours: HourlyPoint[];
  currentTime: string;
  /** Stroke/fill colour, typically the current UV-band colour. */
  color: string;
  /** Horizontal padding already applied by the parent, used to size the chart. */
  horizontalPadding?: number;
}

const HEIGHT = 150;
const TOP = 14;
const BOTTOM = 118; // baseline y; labels sit below

interface Pt {
  x: number;
  y: number;
}

// Catmull-Rom through the points, emitted as cubic beziers for a smooth curve.
function smoothPath(pts: Pt[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function UvCurve({ hours, currentTime, color, horizontalPadding = 24 }: Props) {
  const { colors } = useTheme();
  const { width: screenW } = useWindowDimensions();
  const width = screenW - horizontalPadding * 2;

  if (hours.length < 2) return null;

  const values = hours.map((h) => Math.max(0, h.uv));
  const maxUv = Math.max(9, Math.ceil(Math.max(...values)));
  const n = hours.length;

  const xAt = (i: number) => (width * i) / (n - 1);
  const yAt = (uv: number) => TOP + (BOTTOM - TOP) * (1 - Math.min(uv, maxUv) / maxUv);

  const pts: Pt[] = values.map((uv, i) => ({ x: xAt(i), y: yAt(uv) }));
  const stroke = smoothPath(pts);
  const area = `${stroke} L ${xAt(n - 1)} ${BOTTOM} L ${xAt(0)} ${BOTTOM} Z`;

  // Current hour position along the series.
  const nowKey = currentTime.slice(0, 13);
  const nowIdx = hours.findIndex((h) => h.time.slice(0, 13) === nowKey);
  const now = nowIdx >= 0 ? { x: xAt(nowIdx), y: yAt(values[nowIdx]) } : null;

  // A few evenly distributed hour labels, positioned under their data point.
  const labelIdxs = [...new Set([0, Math.round((n - 1) / 2), n - 1, nowIdx].filter((i) => i >= 0))]
    .sort((a, b) => a - b);
  const LBL_W = 28;
  const labels = labelIdxs.map((i) => ({
    key: String(i),
    now: i === nowIdx,
    text: i === nowIdx ? 'now' : shortHour(hours[i].time),
    left: Math.min(Math.max(xAt(i) - LBL_W / 2, 0), width - LBL_W),
  }));

  return (
    <View style={{ width }}>
      <Svg width={width} height={HEIGHT}>
        <Defs>
          <LinearGradient id="uvFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity={0.28} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </LinearGradient>
        </Defs>

        <Line x1={0} y1={BOTTOM} x2={width} y2={BOTTOM} stroke={colors.border} strokeWidth={1} />
        <Path d={area} fill="url(#uvFill)" />
        <Path d={stroke} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" />

        {now ? (
          <>
            <Line
              x1={now.x}
              y1={TOP - 6}
              x2={now.x}
              y2={BOTTOM}
              stroke={colors.border}
              strokeWidth={1}
            />
            <Circle cx={now.x} cy={now.y} r={6} fill={colors.background} />
            <Circle cx={now.x} cy={now.y} r={4.5} fill={colors.text} />
          </>
        ) : null}
      </Svg>

      <View style={styles.labels}>
        {labels.map((l) => (
          <Text
            key={l.key}
            style={[
              styles.label,
              { color: l.now ? colors.textDim : colors.textFaint, left: l.left },
            ]}
          >
            {l.text}
          </Text>
        ))}
      </View>
    </View>
  );
}

function shortHour(iso: string): string {
  const { hour } = parseLocal(iso);
  if (hour === 0) return '12a';
  if (hour === 12) return '12p';
  return hour < 12 ? `${hour}a` : `${hour - 12}p`;
}

const styles = StyleSheet.create({
  labels: {
    height: 16,
    marginTop: 6,
  },
  label: {
    position: 'absolute',
    width: 28,
    textAlign: 'center',
    fontFamily: fonts.regular,
    fontSize: font.micro,
  },
});
