import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Recommendation } from '../domain/recommendations';
import { useTheme } from '../theme/useTheme';
import { fonts } from '../theme/fonts';
import { font, spacing } from '../theme/tokens';

interface Props {
  recommendation: Recommendation;
}

// Editorial protection block: a one-word imperative headline, the band's advice,
// then any situational context tips. No card chrome — sits on the black canvas.
export function RecommendationCard({ recommendation }: Props) {
  const { colors } = useTheme();
  const { level, tips, safeNow } = recommendation;

  return (
    <View>
      <Text style={[styles.headline, { color: colors.text }]}>
        {safeNow ? 'Go enjoy it.' : level.headline}
      </Text>
      <Text style={[styles.advice, { color: colors.textDim }]}>{level.advice.join(' ')}</Text>

      {tips.length > 0 ? (
        <View style={styles.tips}>
          {tips.map((t) => (
            <View key={t.id} style={styles.tipRow}>
              <Ionicons name={t.icon as never} size={15} color={colors.accent} />
              <Text style={[styles.tipText, { color: colors.textDim }]}>{t.text}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  headline: {
    fontFamily: fonts.bold,
    fontSize: 30,
    letterSpacing: -0.5,
  },
  advice: {
    fontFamily: fonts.regular,
    fontSize: font.body,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  tips: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  tipText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: font.caption,
    lineHeight: 20,
  },
});
