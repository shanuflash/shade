import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Recommendation } from '../domain/recommendations';
import { useTheme } from '../theme/useTheme';
import { font, spacing, weight } from '../theme/tokens';
import { Card } from './Card';
import { DotRow } from './DotRow';

interface Props {
  recommendation: Recommendation;
}

export function RecommendationCard({ recommendation }: Props) {
  const { colors } = useTheme();
  const { level, tips } = recommendation;

  return (
    <Card title="Protection">
      <Text style={[styles.tip, { color: colors.text }]}>{level.shortTip}</Text>
      <View style={styles.metaRow}>
        <DotRow filled={level.index + 1} color={level.color} size={8} />
        <Text style={[styles.range, { color: colors.textDim }]}>
          {level.label} · UV {level.range}
        </Text>
      </View>

      <View style={styles.advice}>
        {level.advice.map((a) => (
          <View key={a} style={styles.adviceRow}>
            <View style={[styles.dot, { backgroundColor: level.color }]} />
            <Text style={[styles.adviceText, { color: colors.textDim }]}>{a}</Text>
          </View>
        ))}
      </View>

      {tips.length > 0 ? (
        <View style={[styles.tips, { borderTopColor: colors.border }]}>
          {tips.map((t) => (
            <View key={t.id} style={styles.tipRow}>
              <Ionicons name={t.icon as never} size={16} color={colors.accent} />
              <Text style={[styles.contextText, { color: colors.text }]}>{t.text}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  tip: {
    fontSize: font.title,
    fontWeight: weight.bold,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  range: {
    fontSize: font.caption,
    fontWeight: weight.medium,
  },
  advice: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  adviceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  adviceText: {
    flex: 1,
    fontSize: font.body,
    lineHeight: 21,
  },
  tips: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.md,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  contextText: {
    flex: 1,
    fontSize: font.body,
    fontWeight: weight.medium,
    lineHeight: 21,
  },
});
