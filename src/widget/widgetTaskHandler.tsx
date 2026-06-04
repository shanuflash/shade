import type { WidgetTaskHandlerProps } from 'react-native-android-widget';

import { getForecast } from '../api/openMeteo';
import {
  isCacheStale,
  readForecastCache,
  readLastLocation,
  writeForecastCache,
  type CachedForecast,
} from '../data/cache';
import { renderWidgetByName } from './update';

// Runs headless when Android adds, updates, resizes, or clicks a widget. Android
// honours each widget's updatePeriodMillis (~30 min) more reliably than the
// background task, so on ADDED/UPDATE we refetch when the cache is stale. This
// keeps the widget current using the last known location, with no live GPS.
export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const name = props.widgetInfo.widgetName;

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE': {
      const data = await refreshIfStale();
      props.renderWidget(renderWidgetByName(name, data));
      break;
    }
    case 'WIDGET_RESIZED':
    case 'WIDGET_CLICK': {
      const cached = await readForecastCache();
      props.renderWidget(renderWidgetByName(name, cached));
      break;
    }
    default:
      break;
  }
}

// Returns fresh data when the cache is stale and a refetch succeeds, otherwise
// whatever is cached. Never throws so the widget always renders something.
async function refreshIfStale(): Promise<CachedForecast | null> {
  const cached = await readForecastCache();
  if (!isCacheStale(cached)) return cached;

  const location = await readLastLocation();
  if (!location) return cached;

  try {
    const forecast = await getForecast(location.latitude, location.longitude);
    await writeForecastCache(forecast, location);
    return { forecast, location, fetchedAt: Date.now() };
  } catch {
    return cached;
  }
}
