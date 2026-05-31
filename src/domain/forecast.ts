import type { Forecast, HourlyPoint, OpenMeteoForecastResponse } from '../api/types';
import { dayOf } from '../utils/time';

const MAX_UPCOMING_HOURS = 24;

export function normalizeForecast(res: OpenMeteoForecastResponse): Forecast {
  const { current, hourly, daily } = res;
  if (!current || !hourly || !daily) {
    throw new Error('Incomplete forecast response from Open-Meteo.');
  }

  const points: HourlyPoint[] = hourly.time.map((time, i) => ({
    time,
    uv: hourly.uv_index[i] ?? 0,
    uvClearSky: hourly.uv_index_clear_sky[i] ?? 0,
    cloudCover: hourly.cloud_cover[i] ?? 0,
  }));

  const currentTime = current.time;
  const today = dayOf(currentTime);
  const currentHourKey = currentTime.slice(0, 13); // "YYYY-MM-DDTHH"

  const upcoming = points
    .filter((p) => p.time.slice(0, 13) >= currentHourKey)
    .slice(0, MAX_UPCOMING_HOURS);

  const todayHourly = points.filter((p) => dayOf(p.time) === today);
  const currentPoint = points.find((p) => p.time.slice(0, 13) === currentHourKey);

  // Peak from the hourly series is more precise than the daily max alone.
  let peak: HourlyPoint | null = null;
  for (const p of todayHourly) {
    if (!peak || p.uv > peak.uv) peak = p;
  }

  const dailyMaxFromApi = daily.uv_index_max[0] ?? 0;

  return {
    currentUv: current.uv_index ?? 0,
    currentTime,
    currentCloudCover: currentPoint?.cloudCover ?? null,
    currentUvClearSky: currentPoint?.uvClearSky ?? null,
    hourly: upcoming,
    todayHourly,
    todayMaxUv: Math.max(dailyMaxFromApi, peak?.uv ?? 0),
    todayPeakTime: peak ? peak.time : null,
    sunrise: daily.sunrise[0] ?? '',
    sunset: daily.sunset[0] ?? '',
    timezone: res.timezone,
  };
}
