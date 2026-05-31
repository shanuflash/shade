import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type { HourlyPoint } from '../api/types';
import { uvLevel } from '../domain/uvLevels';
import { useTheme } from '../theme/useTheme';
import { fonts } from '../theme/fonts';
import { font, spacing, weight } from '../theme/tokens';
import { hourLabel } from '../utils/time';
import { Card } from './Card';

interface Props {
  hours: HourlyPoint[];
}

export function HourlyForecast({ hours }: Props) {
  const { colors } = useTheme();
  const data = hours.slice(0, 12);

  return (
    <Card title="Hourly UV">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {data.map((h, i) => {
          const level = uvLevel(h.uv);
          return (
            <View key={h.time} style={styles.col}>
              <Text style={[styles.time, { color: colors.textDim }]}>
                {i === 0 ? 'Now' : hourLabel(h.time)}
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>{Math.round(h.uv)}</Text>
              <View style={[styles.bandDot, { backgroundColor: level.color }]} />
            </View>
          );
        })}
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.xl,
    paddingRight: spacing.sm,
    alignItems: 'center',
  },
  col: {
    alignItems: 'center',
    gap: spacing.md,
  },
  time: {
    fontSize: font.micro,
    fontWeight: weight.semibold,
  },
  value: {
    fontFamily: fonts.dot,
    fontSize: 26,
    includeFontPadding: false,
  },
  bandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
