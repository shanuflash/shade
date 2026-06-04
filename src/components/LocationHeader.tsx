import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../theme/useTheme';
import { fonts } from '../theme/fonts';
import { font, radius, spacing, weight } from '../theme/tokens';

interface Props {
  label: string;
  isAuto: boolean;
  refreshing?: boolean;
  onSearch: () => void;
  onSettings: () => void;
}

function todayLabel(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function LocationHeader({ label, isAuto, refreshing, onSearch, onSettings }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Pressable style={styles.location} onPress={onSearch} hitSlop={8}>
        <View style={styles.cityRow}>
          <Ionicons
            name={isAuto ? 'location' : 'location-outline'}
            size={14}
            color={colors.accent}
          />
          <Text style={[styles.city, { color: colors.text }]} numberOfLines={1}>
            {label}
          </Text>
          {refreshing ? (
            <ActivityIndicator size="small" color={colors.textDim} />
          ) : (
            <Ionicons name="chevron-down" size={14} color={colors.textDim} />
          )}
        </View>
        <Text style={[styles.date, { color: colors.textFaint }]}>{todayLabel()}</Text>
      </Pressable>

      <Pressable
        style={[styles.iconBtn, { borderColor: colors.border }]}
        onPress={onSettings}
        hitSlop={8}
      >
        <Ionicons name="ellipsis-horizontal" size={18} color={colors.textDim} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  location: {
    flex: 1,
    gap: 2,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  city: {
    fontFamily: fonts.semibold,
    fontSize: font.title,
    fontWeight: weight.semibold,
    maxWidth: 220,
  },
  date: {
    fontFamily: fonts.regular,
    fontSize: font.caption,
    marginLeft: 20,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
