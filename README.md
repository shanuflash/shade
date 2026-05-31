# Shade — Live UV Index Tracker

Shade is an Android-first Expo (React Native) app for live UV index tracking and
sun-protection guidance. It shows the current UV, an hourly forecast, today's peak
UV and time, context-aware safety recommendations, and a color-coded home-screen
widget — all powered by the free [Open-Meteo](https://open-meteo.com) API with no
backend.

## Features

- **Current UV index** with an animated, color-coded gauge.
- **Hourly UV forecast** and **today's peak UV + peak time**.
- **Context-aware recommendations** — high UV despite cloud cover, safer outdoor
  windows, UV dropping near sunset, and outdoor-activity suggestions.
- **Home-screen widget** (color-coded risk, current UV, today's max, quick tip,
  "Safe outside now" status).
- **Auto location** (with permission) and **manual city search**.
- **Offline-friendly caching** and **battery-efficient background refresh**.
- Minimal, modern UI with first-class **dark mode**.

## Tech stack

| Concern            | Choice |
| ------------------ | ------ |
| Framework          | Expo SDK 56 (React Native, New Architecture), TypeScript |
| Navigation         | expo-router (file-based) |
| Data fetching      | TanStack Query (persisted to AsyncStorage) |
| Local state        | Zustand (persisted) |
| Weather/UV data    | Open-Meteo `/v1/forecast` + geocoding API |
| Location           | expo-location |
| Background refresh  | expo-background-task (WorkManager under the hood) |
| Widget             | react-native-android-widget (config plugin) |
| Animations/visuals | react-native-reanimated, react-native-svg |

## Architecture

```
app/                 expo-router screens (index, search, settings)
src/
  api/               Open-Meteo forecast + geocoding + fetch client
  domain/            UV bands, recommendation logic, forecast normalization (pure)
  data/              query client + persistence, shared widget cache, query keys
  state/             zustand settings store
  hooks/             useForecast, useAutoLocation
  theme/             tokens, palettes, useTheme
  components/        gauge, cards, header, state views
  widget/            widget UI + task handler + update helper
  tasks/             background refresh task
  utils/             local-time helpers
index.js             registers the widget task handler, then expo-router entry
```

**Caching strategy.** TanStack Query keeps forecasts fresh for 30 minutes and
persists them to AsyncStorage so the last reading shows instantly on launch. Every
successful fetch also writes a compact shared cache (`src/data/cache.ts`) that both
the widget's headless task and the background refresh task read — a single source of
truth across the app and the widget.

**Background refresh.** A `expo-background-task` job (~30-min OS-scheduled interval)
refreshes the active location's UV in the background, updates the shared cache, and
pushes a widget update. No foreground polling.

## Running locally

> Requires a custom dev build (the widget + background task use native modules, so
> Expo Go is not sufficient).

```bash
npm install
npx expo run:android   # builds and installs a dev client on a device/emulator
```

Then long-press the home screen → Widgets → **Shade UV Index** to add the widget.

## CI builds (no local Android setup needed)

Every push to the feature branch runs `.github/workflows/android-build.yml`, which
runs `expo prebuild`, builds a debug-signed APK with Gradle, and uploads it as the
`shade-debug-apk` artifact. Download it from the workflow run and sideload it onto a
device.

## Scripts

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # expo lint
npm run prebuild    # generate the native android/ project
```

## Attribution

Weather and UV data by [Open-Meteo.com](https://open-meteo.com) (CC BY 4.0).
