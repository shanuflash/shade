import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HourlyForecast } from '../src/components/HourlyForecast';
import { LocationHeader } from '../src/components/LocationHeader';
import { PeakUvCard } from '../src/components/PeakUvCard';
import { RecommendationCard } from '../src/components/RecommendationCard';
import { SafeWindowsCard } from '../src/components/SafeWindowsCard';
import { LoadingView, MessageView } from '../src/components/StateViews';
import { UvGauge } from '../src/components/UvGauge';
import { buildRecommendation } from '../src/domain/recommendations';
import { useAutoLocation } from '../src/hooks/useAutoLocation';
import { useForecast } from '../src/hooks/useForecast';
import { useSettings } from '../src/state/settingsStore';
import { useTheme } from '../src/theme/useTheme';
import { font, radius, spacing, weight } from '../src/theme/tokens';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const mode = useSettings((s) => s.mode);
  const { status, resolve } = useAutoLocation();
  const { data, isLoading, isError, isFetching, refetch, location } = useForecast();

  const recommendation = useMemo(
    () => (data ? buildRecommendation(data) : null),
    [data],
  );

  const header = (
    <LocationHeader
      label={location?.label ?? (mode === 'auto' ? 'Locating...' : 'Choose a city')}
      isAuto={mode === 'auto'}
      refreshing={isFetching}
      onSearch={() => router.push('/search')}
      onSettings={() => router.push('/settings')}
    />
  );

  // No location resolved yet.
  if (!location) {
    return (
      <Screen insetsTop={insets.top}>
        {header}
        {status === 'denied' ? (
          <MessageView
            icon="location-outline"
            title="Location needed"
            message="Allow location access to see UV where you are, or search for a city."
            actionLabel="Search a city"
            onAction={() => router.push('/search')}
          />
        ) : (
          <LoadingView message="Finding your location..." />
        )}
      </Screen>
    );
  }

  if (isLoading && !data) {
    return (
      <Screen insetsTop={insets.top}>
        {header}
        <LoadingView message="Loading UV forecast..." />
      </Screen>
    );
  }

  if (isError && !data) {
    return (
      <Screen insetsTop={insets.top}>
        {header}
        <MessageView
          icon="cloud-offline-outline"
          title="Couldn't load forecast"
          message="Check your connection and try again."
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      </Screen>
    );
  }

  if (!data || !recommendation) {
    return (
      <Screen insetsTop={insets.top}>
        {header}
        <LoadingView />
      </Screen>
    );
  }

  return (
    <Screen insetsTop={insets.top}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={() => {
              if (mode === 'auto') void resolve();
              void refetch();
            }}
            tintColor={colors.textDim}
          />
        }
      >
        {header}

        <View style={styles.hero}>
          <UvGauge uv={data.currentUv} />
          <View
            style={[
              styles.statusPill,
              {
                backgroundColor: recommendation.safeNow ? '#15351F' : recommendation.level.color,
              },
            ]}
          >
            <Ionicons
              name={recommendation.safeNow ? 'checkmark-circle' : 'warning'}
              size={16}
              color="#FFFFFF"
            />
            <Text style={styles.statusText}>
              {recommendation.safeNow ? 'Safe outside now' : recommendation.level.shortTip}
            </Text>
          </View>
        </View>

        <RecommendationCard recommendation={recommendation} />
        <SafeWindowsCard windows={recommendation.safeWindows} />
        <PeakUvCard forecast={data} />
        <HourlyForecast hours={data.hourly} />

        <Text style={[styles.attribution, { color: colors.textFaint }]}>
          Weather data by Open-Meteo.com
        </Text>
      </ScrollView>
    </Screen>
  );
}

function Screen({ children, insetsTop }: { children: React.ReactNode; insetsTop: number }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insetsTop + spacing.sm }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.lg,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: font.body,
    fontWeight: weight.bold,
  },
  attribution: {
    fontSize: font.micro,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
