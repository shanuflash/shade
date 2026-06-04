# Shade

An Android UV index app built with Expo and React Native. A sleek, black,
editorial interface shows the current UV, the curve through the day, and what
protection you need, plus a circular home-screen widget. Data comes from the
free [Open-Meteo](https://open-meteo.com) API. There is no backend.

## Features

- Big, color-coded current UV with a 0–11 scale and the band label
- A smooth UV-through-the-day curve with a "now" marker
- Protection advice per UV band, with extra tips for cloud cover, sunset, and
  safer time windows
- Peak, next safe time, and sunset at a glance
- A circular 1×1 home-screen widget that refreshes itself
- Automatic location or manual city search
- Local caching and background refresh, so it works offline and stays light on
  battery
- Dark-first design (Space Grotesk), with a light theme

## Stack

- Expo SDK 56, React Native (New Architecture), TypeScript
- expo-router for navigation
- TanStack Query for data, persisted to AsyncStorage
- Zustand for settings
- expo-location for location
- expo-background-task for periodic refresh
- react-native-android-widget for the widget
- react-native-svg for the UV curve, react-native-reanimated for entrance motion
- Space Grotesk via @expo-google-fonts

## Layout

```
app/                 screens: index, search, settings
src/
  api/               Open-Meteo forecast, geocoding, fetch client
  domain/            UV bands, recommendation logic, forecast parsing
  data/              query client, shared widget cache, query keys
  state/             settings store
  hooks/             useForecast, useAutoLocation
  theme/             tokens, palettes, useTheme
  components/        UV curve, header, recommendation, state views
  widget/            widget layout, task handler, update helper
  tasks/             background refresh
  utils/             time helpers
index.js             registers the widget handler, then expo-router
```

## How data flows

A forecast is fetched for the active location and cached for 30 minutes. TanStack
Query persists it to AsyncStorage, so the last reading shows immediately on the
next launch. Each successful fetch also writes a small payload to
`src/data/cache.ts`, which the widgets and the background task read. That keeps
the app and the widgets showing the same numbers.

Refresh happens through two complementary triggers, both using the last known
location (no live GPS needed). The background task
(`src/tasks/backgroundRefresh.ts`) runs via Android WorkManager, and the
widget's own ~30-minute tick (`src/widget/widgetTaskHandler.tsx`) refetches when
the cache is stale — Android honours that tick reliably. Reopening the app also
refetches if the cache has aged. There is no foreground polling.

## Running it

The widgets and background task need native modules, so Expo Go won't work. Build
a dev client:

```bash
npm install
npx expo run:android
```

To add the widget, long-press the home screen, open Widgets, and pick Shade UV.

## Building an APK without Android Studio

`.github/workflows/android-build.yml` builds the app in CI. Pushes to `main`
build an APK and upload it as a run artifact. Pushing a version tag (for example
`v0.1.0`) also publishes a GitHub Release with the APK attached. You can also
trigger a release from the Actions tab using Run workflow and a version input.

The release APK is signed with the debug keystore, so it installs on any device
without extra setup. For releases to work, set Settings > Actions > General >
Workflow permissions to "Read and write permissions".

## Scripts

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # expo lint
npm run prebuild    # generate the native android/ project
```

## Data

Weather and UV data from [Open-Meteo](https://open-meteo.com), used under their
free tier for non-commercial apps (CC BY 4.0).
