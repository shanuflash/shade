import React from 'react';
import { requestWidgetUpdate } from 'react-native-android-widget';

import type { Forecast, SavedLocation } from '../api/types';
import type { CachedForecast } from '../data/cache';
import { widgetComponents, widgetNames } from './layouts';

/** Render a widget by its Android name from a cached payload. */
export function renderWidgetByName(name: string, data: CachedForecast | null) {
  const Component = widgetComponents[name] ?? widgetComponents.UvSmall;
  return <Component data={data} />;
}

/**
 * Push fresh data to every placed widget size. Safe to call even when none are
 * on the home screen — the `widgetNotFound` branch simply no-ops.
 */
export async function updateUvWidget(forecast: Forecast, location: SavedLocation) {
  const data: CachedForecast = { forecast, location, fetchedAt: Date.now() };
  for (const name of widgetNames) {
    try {
      await requestWidgetUpdate({
        widgetName: name,
        renderWidget: () => renderWidgetByName(name, data),
        widgetNotFound: () => {
          // No widget of this size placed — nothing to update.
        },
      });
    } catch {
      // requestWidgetUpdate is Android-only; ignore failures elsewhere.
    }
  }
}
