import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cityLabel, searchCities } from '../src/api/geocoding';
import type { CityResult } from '../src/api/types';
import { queryKeys } from '../src/data/keys';
import { useAutoLocation } from '../src/hooks/useAutoLocation';
import { useSettings } from '../src/state/settingsStore';
import { useTheme } from '../src/theme/useTheme';
import { font, radius, spacing, weight } from '../src/theme/tokens';

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const useManualLocation = useSettings((s) => s.useManualLocation);
  const useAutoMode = useSettings((s) => s.useAutoLocation);
  const { resolve } = useAutoLocation();

  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  const { data: results = [], isFetching } = useQuery({
    queryKey: queryKeys.cities(debounced),
    queryFn: () => searchCities(debounced),
    enabled: debounced.trim().length >= 2,
    staleTime: 1000 * 60 * 60,
  });

  const onSelect = (c: CityResult) => {
    useManualLocation({
      latitude: c.latitude,
      longitude: c.longitude,
      label: c.name,
    });
    router.back();
  };

  const onUseCurrent = () => {
    useAutoMode();
    void resolve();
    router.back();
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top + spacing.md }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.text }]}>Choose location</Text>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="close" size={26} color={colors.textDim} />
        </Pressable>
      </View>

      <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="search" size={18} color={colors.textDim} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Search for a city"
          placeholderTextColor={colors.textFaint}
          value={query}
          onChangeText={setQuery}
          autoFocus
          autoCorrect={false}
          returnKeyType="search"
        />
        {isFetching ? <ActivityIndicator size="small" color={colors.textDim} /> : null}
      </View>

      <Pressable
        style={[styles.currentRow, { borderColor: colors.border }]}
        onPress={onUseCurrent}
      >
        <Ionicons name="locate" size={20} color={colors.accent} />
        <Text style={[styles.currentText, { color: colors.accent }]}>Use my current location</Text>
      </Pressable>

      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <Pressable
            style={[styles.resultRow, { borderBottomColor: colors.border }]}
            onPress={() => onSelect(item)}
          >
            <Ionicons name="location-outline" size={20} color={colors.textDim} />
            <Text style={[styles.resultText, { color: colors.text }]} numberOfLines={1}>
              {cityLabel(item)}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          debounced.trim().length >= 2 && !isFetching ? (
            <Text style={[styles.empty, { color: colors.textDim }]}>No cities found.</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: font.h2,
    fontWeight: weight.bold,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: 50,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    fontSize: font.body,
  },
  currentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  currentText: {
    fontSize: font.body,
    fontWeight: weight.semibold,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  resultText: {
    flex: 1,
    fontSize: font.body,
    fontWeight: weight.medium,
  },
  empty: {
    textAlign: 'center',
    marginTop: spacing.xl,
    fontSize: font.body,
  },
});
