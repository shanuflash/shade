import React from 'react';
import { requestWidgetUpdate } from 'react-native-android-widget';

import type { Forecast, SavedLocation } from '../api/types';
import type { CachedForecast } from '../data/cache';
import { UvWidget } from './UvWidget';

const WIDGET_NAME = 'Uv';

/** Render the widget from a cached payload (shared by the task handler). */
export function renderUvWidget(data: CachedForecast | null) {
  return <UvWidget data={data} />;
}

/**
 * Push fresh data to any placed widgets. Safe to call even when no widget is
 * on the home screen — the `widgetNotFound` branch simply no-ops.
 */
export async function updateUvWidget(forecast: Forecast, location: SavedLocation) {
  const data: CachedForecast = { forecast, location, fetchedAt: Date.now() };
  try {
    await requestWidgetUpdate({
      widgetName: WIDGET_NAME,
      renderWidget: () => renderUvWidget(data),
      widgetNotFound: () => {
        // No widget placed yet — nothing to update.
      },
    });
  } catch {
    // requestWidgetUpdate is Android-only; ignore failures on other platforms.
  }
}
