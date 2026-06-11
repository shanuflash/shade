export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  /** Ground elevation at the location, metres. Used for the altitude UV boost. */
  elevation?: number;
  timezone: string;
  utc_offset_seconds: number;
  current?: {
    time: string;
    uv_index: number;
  };
  hourly?: {
    time: string[];
    uv_index: number[];
    uv_index_clear_sky: number[];
    cloud_cover: number[];
  };
  daily?: {
    time: string[];
    uv_index_max: number[];
    sunrise: string[];
    sunset: string[];
  };
}

export interface HourlyPoint {
  /** Local wall-clock ISO string, e.g. "2026-05-31T14:00". */
  time: string;
  uv: number;
  uvClearSky: number;
  cloudCover: number;
}

export interface Forecast {
  currentUv: number;
  /** Ground elevation in metres (0 when the API omits it). */
  elevation: number;
  currentTime: string;
  /** Null when the current hour isn't present in the response. */
  currentCloudCover: number | null;
  currentUvClearSky: number | null;
  hourly: HourlyPoint[];
  todayHourly: HourlyPoint[];
  todayMaxUv: number;
  /** Null if today's hourly series is empty. */
  todayPeakTime: string | null;
  sunrise: string;
  sunset: string;
  timezone: string;
}

export interface CityResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export interface SavedLocation {
  latitude: number;
  longitude: number;
  label: string;
}
