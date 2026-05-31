import type { WidgetTaskHandlerProps } from 'react-native-android-widget';

import { readForecastCache } from '../data/cache';
import { renderWidgetByName } from './update';

/**
 * Runs in a headless JS context when Android interacts with any widget
 * (added, periodic update, resized, clicked). Renders the layout matching the
 * widget's name from the shared cache.
 */
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
