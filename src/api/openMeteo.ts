import { normalizeForecast } from '../domain/forecast';
import { buildUrl, fetchJson } from './client';
import type { Forecast, OpenMeteoForecastResponse } from './types';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export async function getForecast(latitude: number, longitude: number): Promise<Forecast> {
  const url = buildUrl(FORECAST_URL, {
    latitude: latitude.toFixed(4),
    longitude: longitude.toFixed(4),
    current: 'uv_index',
    hourly: 'uv_index,uv_index_clear_sky,cloud_cover',
    daily: 'uv_index_max,sunrise,sunset',
    timezone: 'auto',
    forecast_days: 2,
  });
  const res = await fetchJson<OpenMeteoForecastResponse>(url);
  return normalizeForecast(res);
}
