import type { WidgetTaskHandlerProps } from 'react-native-android-widget';

import { readForecastCache } from '../data/cache';
import { renderWidgetByName } from './update';

// Runs headless when Android adds, updates, resizes, or clicks a widget, and
// renders the matching layout from the shared cache.
export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const cached = await readForecastCache();
  const name = props.widgetInfo.widgetName;

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED':
    case 'WIDGET_CLICK':
      props.renderWidget(renderWidgetByName(name, cached));
      break;
    default:
      break;
  }
}
