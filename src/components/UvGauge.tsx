import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { uvLevel } from '../domain/uvLevels';
import { useTheme } from '../theme/useTheme';
import { font, weight } from '../theme/tokens';

const SIZE = 224;
const CENTER = SIZE / 2;
const RING_RADIUS = 96;
const DOT_RADIUS = 3.6;
const DOT_COUNT = 40;
const START_DEG = 135; // opens at the bottom
const SWEEP_DEG = 270;
const MAX_UV = 11;

interface Props {
  uv: number;
}

// A ring of dots that lights up in proportion to the UV value, with the number
// in the middle. The lit dots use the risk color.
export function UvGauge({ uv }: Props) {
  const { colors } = useTheme();
  const level = uvLevel(uv);
  const fraction = Math.max(0, Math.min(1, uv / MAX_UV));
  const lit = Math.round(fraction * DOT_COUNT);

  const dots = Array.from({ length: DOT_COUNT }).map((_, i) => {
    const t = i / (DOT_COUNT - 1);
    const rad = ((START_DEG + t * SWEEP_DEG) * Math.PI) / 180;
    return {
      x: CENTER + RING_RADIUS * Math.cos(rad),
      y: CENTER + RING_RADIUS * Math.sin(rad),
      on: i < lit,
    };
  });

  return (
    <Animated.View entering={FadeIn.duration(450)} style={styles.wrap}>
      <Svg width={SIZE} height={SIZE}>
        {dots.map((d, i) => (
          <Circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={DOT_RADIUS}
            fill={d.on ? level.color : colors.dotEmpty}
          />
        ))}
      </Svg>

      <View style={styles.center} pointerEvents="none">
        <Text style={[styles.value, { color: colors.text }]}>{Math.round(uv)}</Text>
        <Text style={[styles.label, { color: level.color }]}>{level.label}</Text>
        <Text style={[styles.caption, { color: colors.textFaint }]}>UV INDEX</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: font.display,
    fontWeight: weight.heavy,
    lineHeight: font.display + 4,
  },
  label: {
    fontSize: font.title,
    fontWeight: weight.bold,
    marginTop: 2,
  },
  caption: {
    fontSize: font.micro,
    fontWeight: weight.bold,
    letterSpacing: 1.5,
    marginTop: 4,
  },
});
