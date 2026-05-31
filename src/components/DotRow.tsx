import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '../theme/useTheme';

interface Props {
  /** How many dots are lit. */
  filled: number;
  /** Total dots. */
  total?: number;
  color: string;
  size?: number;
}

// A row of dots with `filled` of them lit. Used to show the UV band as N of 5.
export function DotRow({ filled, total = 5, color, size = 7 }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            marginRight: i < total - 1 ? size * 0.7 : 0,
            backgroundColor: i < filled ? color : colors.dotEmpty,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
