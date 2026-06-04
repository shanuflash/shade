import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../theme/useTheme';
import { fonts } from '../theme/fonts';
import { font, radius, spacing, weight } from '../theme/tokens';

export function LoadingView({ message }: { message?: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.accent} />
      {message ? <Text style={[styles.text, { color: colors.textDim }]}>{message}</Text> : null}
    </View>
  );
}

interface MessageProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function MessageView({ icon, title, message, actionLabel, onAction }: MessageProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.center}>
      <Ionicons name={icon} size={48} color={colors.textFaint} />
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.text, { color: colors.textDim }]}>{message}</Text>
      {actionLabel && onAction ? (
        <Pressable style={[styles.action, { backgroundColor: colors.accent }]} onPress={onAction}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: font.title,
    fontWeight: weight.bold,
    marginTop: spacing.sm,
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: font.body,
    textAlign: 'center',
    lineHeight: 22,
  },
  action: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  actionText: {
    fontFamily: fonts.bold,
    color: '#FFFFFF',
    fontSize: font.body,
    fontWeight: weight.bold,
  },
});
