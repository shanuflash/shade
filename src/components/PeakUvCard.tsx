import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Forecast } from '../api/types';
import { uvLevel } from '../domain/uvLevels';
import { useTheme } from '../theme/useTheme';
import { font, spacing, weight } from '../theme/tokens';
import { clockLabel, hourLabel } from '../utils/time';
import { Card } from './Card';

interface Props {
  forecast: Forecast;
}

export function PeakUvCard({ forecast }: Props) {
  const { colors } = useTheme();
  const peakLevel = uvLevel(forecast.todayMaxUv);

  const stats = [
    {
      icon: 'trending-up-outline' as const,
      label: 'Peak UV',
      value: `${Math.round(forecast.todayMaxUv)}`,
      sub: peakLevel.label,
      color: peakLevel.color,
    },
    {
      icon: 'time-outline' as const,
      label: 'Peak time',
      value: forecast.todayPeakTime ? hourLabel(forecast.todayPeakTime) : 'N/A',
      sub: 'highest today',
      color: colors.text,
    },
    {
      icon: 'partly-sunny-outline' as const,
      label: 'Sunset',
      value: forecast.sunset ? clockLabel(forecast.sunset) : 'N/A',
      sub: 'UV fades after',
      color: colors.text,
    },
  ];

  return (
    <Card title="Today's peak">
      <View style={styles.row}>
        {stats.map((s) => (
          <View key={s.label} style={styles.stat}>
            <Ionicons name={s.icon} size={18} color={colors.textDim} />
            <Text style={[styles.value, { color: s.color }]} numberOfLines={1}>
              {s.value}
            </Text>
            <Text style={[styles.label, { color: colors.text }]}>{s.label}</Text>
            <Text style={[styles.sub, { color: colors.textDim }]}>{s.sub}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 2,
  },
  value: {
    fontSize: font.h2,
    fontWeight: weight.heavy,
    marginTop: spacing.sm,
  },
  label: {
    fontSize: font.caption,
    fontWeight: weight.semibold,
  },
  sub: {
    fontSize: font.micro,
    fontWeight: weight.medium,
  },
});
