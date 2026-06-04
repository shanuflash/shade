import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { useTheme } from '../theme/useTheme';
import { fonts } from '../theme/fonts';
import { font, radius, spacing } from '../theme/tokens';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ title, children, style }: CardProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        style,
      ]}
    >
      {title ? (
        <Text style={[styles.title, { color: colors.textDim }]}>{title.toUpperCase()}</Text>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: font.micro,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
});
