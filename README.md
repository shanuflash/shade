# Shade

An Android UV index app built with Expo and React Native. It shows the current
UV, an hourly forecast, today's peak, and what protection you need, plus
home-screen widgets in four sizes. Data comes from the free
[Open-Meteo](https://open-meteo.com) API. There is no backend.

## Features

- Current UV index on an animated, color-coded gauge
- Hourly forecast and today's peak UV with the time it hits
- Protection advice per UV band, with extra tips for cloud cover, sunset, and
  safer time windows
- Home-screen widgets: 1x1, 2x2, 4x2, and 4x1
- Automatic location or manual city search
- Local caching and background refresh, so it works offline and stays light on
  battery
- Light and dark themes

## Stack

- Expo SDK 56, React Native (New Architecture), TypeScript
- expo-router for navigation
- TanStack Query for data, persisted to AsyncStorage
- Zustand for settings
- expo-location for location
- expo-background-task for periodic refresh
- react-native-android-widget for the widgets
- react-native-reanimated and react-native-svg for the gauge

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
  components/        gauge, cards, header, state views
  widget/            widget layouts, task handler, update helper
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

The background task (`src/tasks/backgroundRefresh.ts`) runs roughly every 30
minutes via Android WorkManager. It refreshes the cache and updates the widgets.
There is no foreground polling.

## Running it

The widgets and background task need native modules, so Expo Go won't work. Build
a dev client:

```bash
npm install
npx expo run:android
```

To add a widget, long-press the home screen, open Widgets, and pick a Shade size.

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
