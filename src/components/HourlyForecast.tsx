import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type { HourlyPoint } from '../api/types';
import { uvLevel } from '../domain/uvLevels';
import { useTheme } from '../theme/useTheme';
import { font, radius, spacing, weight } from '../theme/tokens';
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
          const isNow = i === 0;
          return (
            <View key={h.time} style={styles.col}>
              <Text style={[styles.time, { color: colors.textDim }]}>
                {isNow ? 'Now' : hourLabel(h.time)}
              </Text>
              <View style={[styles.bar, { backgroundColor: colors.surfaceAlt }]}>
                <View
                  style={[
                    styles.barFill,
                    {
                      backgroundColor: level.color,
                      height: `${Math.max(8, Math.min(100, (h.uv / 11) * 100))}%`,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.value, { color: colors.text }]}>{Math.round(h.uv)}</Text>
            </View>
          );
        })}
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.lg,
    paddingRight: spacing.sm,
  },
  col: {
    alignItems: 'center',
    width: 36,
  },
  time: {
    fontSize: font.micro,
    fontWeight: weight.semibold,
    marginBottom: spacing.sm,
  },
  bar: {
    width: 8,
    height: 90,
    borderRadius: radius.pill,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: 8,
    borderRadius: radius.pill,
  },
  value: {
    fontSize: font.caption,
    fontWeight: weight.bold,
    marginTop: spacing.sm,
  },
});
