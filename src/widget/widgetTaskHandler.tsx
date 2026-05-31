import type { WidgetTaskHandlerProps } from 'react-native-android-widget';

import { readForecastCache } from '../data/cache';
import { renderUvWidget } from './update';

/**
 * Runs in a headless JS context when Android interacts with the widget
 * (added, periodic update, resized, clicked). Renders from the shared cache so
 * the widget shows the latest data the app/background task stored.
 */
export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const cached = await readForecastCache();

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED':
    case 'WIDGET_CLICK':
      props.renderWidget(renderUvWidget(cached));
      break;
    default:
      break;
  }
}
