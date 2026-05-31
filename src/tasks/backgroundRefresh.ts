import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';

import { getForecast } from '../api/openMeteo';
import { readLastLocation, writeForecastCache } from '../data/cache';
import { updateUvWidget } from '../widget/update';

export const UV_REFRESH_TASK = 'shade-uv-refresh';

// Defined at module scope so it registers as soon as this file is imported.
TaskManager.defineTask(UV_REFRESH_TASK, async () => {
  try {
    const location = await readLastLocation();
    if (!location) return BackgroundTask.BackgroundTaskResult.Success;

    const forecast = await getForecast(location.latitude, location.longitude);
    await writeForecastCache(forecast, location);
    await updateUvWidget(forecast, location);
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch {
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

// Registers the OS-scheduled refresh (~30 min, clamped by Android). It runs on
// WorkManager, so there is no foreground polling.
export async function registerBackgroundRefresh(): Promise<void> {
  try {
    const status = await BackgroundTask.getStatusAsync();
    if (status === BackgroundTask.BackgroundTaskStatus.Restricted) return;

    const alreadyRegistered = await TaskManager.isTaskRegisteredAsync(UV_REFRESH_TASK);
    if (!alreadyRegistered) {
      await BackgroundTask.registerTaskAsync(UV_REFRESH_TASK, { minimumInterval: 30 });
    }
  } catch {
    // Background scheduling is best-effort; the app still refreshes on focus.
  }
}
