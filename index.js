import { registerWidgetTaskHandler } from 'react-native-android-widget';

import { widgetTaskHandler } from './src/widget/widgetTaskHandler';

// Register the home-screen widget task handler before the app boots so the
// widget can render even when the app process is started in the background.
registerWidgetTaskHandler(widgetTaskHandler);

// Hand off to expo-router. Using require keeps this after the registration above.
require('expo-router/entry');
