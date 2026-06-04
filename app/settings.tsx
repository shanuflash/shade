import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '../src/components/Card';
import { useSettings, type ThemePref } from '../src/state/settingsStore';
import { useTheme } from '../src/theme/useTheme';
import { fonts } from '../src/theme/fonts';
import { font, radius, spacing, weight } from '../src/theme/tokens';

const THEME_OPTIONS: { value: ThemePref; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'system', label: 'System', icon: 'phone-portrait-outline' },
  { value: 'light', label: 'Light', icon: 'sunny-outline' },
  { value: 'dark', label: 'Dark', icon: 'moon-outline' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const themePref = useSettings((s) => s.themePref);
  const setThemePref = useSettings((s) => s.setThemePref);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top + spacing.md }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="close" size={26} color={colors.textDim} />
        </Pressable>
      </View>

      <Card title="Appearance">
        <View style={styles.segment}>
          {THEME_OPTIONS.map((opt) => {
            const active = themePref === opt.value;
            return (
              <Pressable
                key={opt.value}
                style={[
                  styles.segmentItem,
                  {
                    backgroundColor: active ? colors.accent : colors.surfaceAlt,
                  },
                ]}
                onPress={() => setThemePref(opt.value)}
              >
                <Ionicons
                  name={opt.icon}
                  size={18}
                  color={active ? '#FFFFFF' : colors.textDim}
                />
                <Text
                  style={[
                    styles.segmentText,
                    { color: active ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card title="About">
        <Text style={[styles.aboutTitle, { color: colors.text }]}>Shade</Text>
        <Text style={[styles.aboutText, { color: colors.textDim }]}>
          Live UV index tracking and sun-protection guidance. Weather and UV data provided
          by Open-Meteo.com under their free, open API.
        </Text>
        <Text style={[styles.aboutText, { color: colors.textDim }]}>
          Add the Shade widget to your home screen for an at-a-glance UV check.
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: font.h2,
    fontWeight: weight.bold,
  },
  segment: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  segmentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  segmentText: {
    fontFamily: fonts.semibold,
    fontSize: font.caption,
    fontWeight: weight.semibold,
  },
  aboutTitle: {
    fontFamily: fonts.bold,
    fontSize: font.title,
    fontWeight: weight.bold,
    marginBottom: spacing.sm,
  },
  aboutText: {
    fontFamily: fonts.regular,
    fontSize: font.body,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
});
