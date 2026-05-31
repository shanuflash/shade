import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { uvLevel } from '../domain/uvLevels';
import { useTheme } from '../theme/useTheme';
import { font, weight } from '../theme/tokens';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 220;
const STROKE = 18;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ARC = 0.75; // 270° gauge
const ARC_LEN = CIRCUMFERENCE * ARC;
const MAX_UV = 11;

interface Props {
  uv: number;
}

export function UvGauge({ uv }: Props) {
  const { colors } = useTheme();
  const level = uvLevel(uv);
  const fraction = Math.max(0, Math.min(1, uv / MAX_UV));

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(fraction, { duration: 900 });
  }, [fraction, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: ARC_LEN * (1 - progress.value),
  }));

  return (
    <View style={styles.wrap}>
      <Svg width={SIZE} height={SIZE}>
        {/* Track */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={colors.surfaceAlt}
          strokeWidth={STROKE}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${ARC_LEN} ${CIRCUMFERENCE}`}
          // Rotate so the 270° arc opens at the bottom.
          origin={`${SIZE / 2}, ${SIZE / 2}`}
          rotation={135}
        />
        {/* Progress */}
        <AnimatedCircle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={level.color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${ARC_LEN} ${CIRCUMFERENCE}`}
          animatedProps={animatedProps}
          origin={`${SIZE / 2}, ${SIZE / 2}`}
          rotation={135}
        />
      </Svg>

      <View style={styles.center} pointerEvents="none">
        <Text style={[styles.value, { color: colors.text }]}>{Math.round(uv)}</Text>
        <Text style={[styles.label, { color: level.color }]}>{level.label}</Text>
        <Text style={[styles.caption, { color: colors.textDim }]}>UV Index</Text>
      </View>
    </View>
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
    fontSize: font.caption,
    fontWeight: weight.medium,
    marginTop: 2,
  },
});
