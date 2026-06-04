import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LocationHeader } from '../src/components/LocationHeader';
import { RecommendationCard } from '../src/components/RecommendationCard';
import { LoadingView, MessageView } from '../src/components/StateViews';
import { UvCurve } from '../src/components/UvCurve';
import { buildRecommendation } from '../src/domain/recommendations';
import { useAutoLocation } from '../src/hooks/useAutoLocation';
import { useForecast } from '../src/hooks/useForecast';
import { useSettings } from '../src/state/settingsStore';
import { useTheme } from '../src/theme/useTheme';
import { fonts } from '../src/theme/fonts';
import { font, spacing } from '../src/theme/tokens';
import { clockLabel, hourLabel } from '../src/utils/time';

const PAD = spacing.xl; // 24

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const mode = useSettings((s) => s.mode);
  const { status, resolve } = useAutoLocation();
  const { data, isLoading, isError, isFetching, refetch, location } = useForecast();

  const recommendation = useMemo(() => (data ? buildRecommendation(data) : null), [data]);

  const header = (
    <LocationHeader
      label={location?.label ?? (mode === 'auto' ? 'Locating…' : 'Choose a city')}
      isAuto={mode === 'auto'}
      refreshing={isFetching}
      onSearch={() => router.push('/search')}
      onSettings={() => router.push('/settings')}
    />
  );

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
          <LoadingView message="Finding your location…" />
        )}
      </Screen>
    );
  }

  if (isLoading && !data) {
    return (
      <Screen insetsTop={insets.top}>
        {header}
        <LoadingView message="Loading UV forecast…" />
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

  const { level } = recommendation;
  const uv = Math.round(data.currentUv);

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

        {/* Hero: giant number + band label */}
        <Animated.View entering={FadeInDown.duration(450)} style={styles.hero}>
          <Text style={[styles.bigNumber, { color: colors.text }]}>{uv}</Text>
          <View style={styles.heroSide}>
            <Text style={[styles.heroUv, { color: colors.textDim }]}>UV</Text>
            <Text style={[styles.heroLevel, { color: level.color }]}>
              {level.label.toUpperCase()}
            </Text>
            <Text style={[styles.heroRange, { color: colors.textFaint }]}>of 11+</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(150).duration(500)}>
          <ScaleBar uv={data.currentUv} color={level.color} />
        </Animated.View>

        <Rule />

        <Animated.View entering={FadeInDown.delay(200).duration(450)}>
          <SectionLabel>UV through the day</SectionLabel>
          <UvCurve
            hours={data.todayHourly}
            currentTime={data.currentTime}
            color={level.color}
            horizontalPadding={PAD}
          />
        </Animated.View>

        <Rule />

        <Animated.View entering={FadeInDown.delay(280).duration(450)}>
          <RecommendationCard recommendation={recommendation} />
        </Animated.View>

        <Rule />

        <FooterStats data={data} recommendation={recommendation} />

        <Text style={[styles.attribution, { color: colors.textFaint }]}>
          Data by Open-Meteo.com
        </Text>
      </ScrollView>
    </Screen>
  );
}

function ScaleBar({ uv, color }: { uv: number; color: string }) {
  const { colors } = useTheme();
  const { width: screenW } = useWindowDimensions();
  const trackW = screenW - PAD * 2;
  const frac = Math.max(0, Math.min(uv / 11, 1));
  const left = frac * trackW;

  return (
    <View style={styles.scaleWrap}>
      <View style={[styles.scaleTrack, { backgroundColor: colors.border }]} />
      <View style={[styles.scaleDot, { backgroundColor: color, left: left - 6 }]} />
      <View style={styles.scaleLabels}>
        <Text style={[styles.scaleEnd, { color: colors.textFaint }]}>0</Text>
        <Text style={[styles.scaleEnd, { color: colors.textFaint }]}>11+</Text>
      </View>
    </View>
  );
}

function FooterStats({
  data,
  recommendation,
}: {
  data: NonNullable<ReturnType<typeof useForecast>['data']>;
  recommendation: NonNullable<ReturnType<typeof buildRecommendation>>;
}) {
  const { colors } = useTheme();

  const peak = data.todayPeakTime
    ? `${Math.round(data.todayMaxUv)} · ${hourLabel(data.todayPeakTime)}`
    : `${Math.round(data.todayMaxUv)}`;

  let safe = '—';
  if (recommendation.safeNow) safe = 'Now';
  else if (recommendation.safeWindows[0]) safe = `${recommendation.safeWindows[0].startLabel}`;

  const sunset = data.sunset ? clockLabel(data.sunset) : '—';

  const items = [
    { k: 'PEAK', v: peak },
    { k: 'SAFE', v: safe },
    { k: 'SUNSET', v: sunset },
  ];

  return (
    <View style={styles.footer}>
      {items.map((it) => (
        <View key={it.k} style={styles.footerItem}>
          <Text style={[styles.footerKey, { color: colors.textFaint }]}>{it.k}</Text>
          <Text style={[styles.footerVal, { color: colors.text }]} numberOfLines={1}>
            {it.v}
          </Text>
        </View>
      ))}
    </View>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return <Text style={[styles.sectionLabel, { color: colors.textFaint }]}>{children}</Text>;
}

function Rule() {
  const { colors } = useTheme();
  return <View style={[styles.rule, { backgroundColor: colors.border }]} />;
}

function Screen({ children, insetsTop }: { children: React.ReactNode; insetsTop: number }) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: colors.background, paddingTop: insetsTop + spacing.md },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: PAD,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  bigNumber: {
    fontFamily: fonts.medium,
    fontSize: 150,
    lineHeight: 150,
    includeFontPadding: false,
    letterSpacing: -4,
  },
  heroSide: {
    marginLeft: spacing.xl,
    justifyContent: 'center',
  },
  heroUv: {
    fontFamily: fonts.medium,
    fontSize: 30,
    letterSpacing: 1,
  },
  heroLevel: {
    fontFamily: fonts.bold,
    fontSize: 34,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  heroRange: {
    fontFamily: fonts.regular,
    fontSize: font.body,
    marginTop: spacing.sm,
  },
  scaleWrap: {
    marginTop: spacing.xl,
    height: 28,
    justifyContent: 'center',
  },
  scaleTrack: {
    height: 2,
    borderRadius: 1,
    width: '100%',
  },
  scaleDot: {
    position: 'absolute',
    top: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  scaleEnd: {
    fontFamily: fonts.regular,
    fontSize: font.micro,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.xl,
  },
  sectionLabel: {
    fontFamily: fonts.semibold,
    fontSize: font.micro,
    letterSpacing: 2,
    marginBottom: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
  },
  footerItem: {
    flex: 1,
    gap: 4,
  },
  footerKey: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 1.5,
  },
  footerVal: {
    fontFamily: fonts.medium,
    fontSize: font.title,
  },
  attribution: {
    fontFamily: fonts.regular,
    fontSize: font.micro,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});
