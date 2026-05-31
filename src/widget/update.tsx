import React from 'react';
import { requestWidgetUpdate } from 'react-native-android-widget';

import type { Forecast, SavedLocation } from '../api/types';
import type { CachedForecast } from '../data/cache';
import { widgetComponents, widgetNames } from './layouts';

export function renderWidgetByName(name: string, data: CachedForecast | null) {
  const Component = widgetComponents[name] ?? widgetComponents.UvSmall;
  return <Component data={data} />;
}

// Refreshes every placed widget. widgetNotFound covers sizes the user hasn't added.
export async function updateUvWidget(forecast: Forecast, location: SavedLocation) {
  const data: CachedForecast = { forecast, location, fetchedAt: Date.now() };
  for (const name of widgetNames) {
    try {
      await requestWidgetUpdate({
        widgetName: name,
        renderWidget: () => renderWidgetByName(name, data),
        widgetNotFound: () => {},
      });
    } catch {
      // requestWidgetUpdate is Android-only; ignore failures elsewhere.
    }
  }
}
