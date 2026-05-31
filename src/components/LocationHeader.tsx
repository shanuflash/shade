import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../theme/useTheme';
import { font, radius, spacing, weight } from '../theme/tokens';

interface Props {
  label: string;
  isAuto: boolean;
  refreshing?: boolean;
  onSearch: () => void;
  onSettings: () => void;
}

export function LocationHeader({ label, isAuto, refreshing, onSearch, onSettings }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Pressable
        style={[styles.location, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={onSearch}
        hitSlop={6}
      >
        <Ionicons
          name={isAuto ? 'location' : 'location-outline'}
          size={16}
          color={colors.accent}
        />
        <Text style={[styles.label, { color: colors.text }]} numberOfLines={1}>
          {label}
        </Text>
        {refreshing ? (
          <ActivityIndicator size="small" color={colors.textDim} />
        ) : (
          <Ionicons name="chevron-down" size={16} color={colors.textDim} />
        )}
      </Pressable>

      <Pressable
        style={[styles.iconBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={onSettings}
        hitSlop={6}
      >
        <Ionicons name="settings-outline" size={18} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  location: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    height: 44,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    flex: 1,
    fontSize: font.body,
    fontWeight: weight.semibold,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
