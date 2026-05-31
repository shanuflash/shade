import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { SafeWindow } from '../domain/recommendations';
import { useTheme } from '../theme/useTheme';
import { font, radius, spacing, weight } from '../theme/tokens';
import { Card } from './Card';

interface Props {
  windows: SafeWindow[];
}

export function SafeWindowsCard({ windows }: Props) {
  const { colors } = useTheme();
  if (windows.length === 0) return null;

  return (
    <Card title="Safer outdoor windows">
      <View style={styles.list}>
        {windows.map((w) => (
          <View key={w.start} style={[styles.pill, { backgroundColor: colors.surfaceAlt }]}>
            <Ionicons name="sunny-outline" size={16} color="#3DBE6E" />
            <Text style={[styles.text, { color: colors.text }]}>
              {w.startLabel} to {w.endLabel}
            </Text>
            <Text style={[styles.sub, { color: colors.textDim }]}>Low UV</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  text: {
    flex: 1,
    fontSize: font.body,
    fontWeight: weight.semibold,
  },
  sub: {
    fontSize: font.caption,
    fontWeight: weight.medium,
  },
});
