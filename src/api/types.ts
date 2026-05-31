// Raw Open-Meteo /v1/forecast response (only the fields we request).
export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
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

// A single hour of the normalized forecast.
export interface HourlyPoint {
  /** Local wall-clock ISO string, e.g. "2026-05-31T14:00". */
  time: string;
  uv: number;
  uvClearSky: number;
  cloudCover: number;
}

// Normalized forecast consumed by the UI, recommendations, and the widget.
export interface Forecast {
  currentUv: number;
  /** Local wall-clock ISO string for "now" as reported by the API. */
  currentTime: string;
  /** Cloud cover (%) at the current hour, when available. */
  currentCloudCover: number | null;
  /** Clear-sky UV at the current hour, when available. */
  currentUvClearSky: number | null;
  /** Upcoming hours (from the current hour onward), capped to ~24h. */
  hourly: HourlyPoint[];
  /** All of today's hourly points (for peak detection / safe windows). */
  todayHourly: HourlyPoint[];
  todayMaxUv: number;
  /** Local ISO string of today's peak UV hour, or null. */
  todayPeakTime: string | null;
  sunrise: string;
  sunset: string;
  timezone: string;
}

// A geocoding search result (Open-Meteo geocoding API).
export interface CityResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

// A resolved location (auto or manual) used for fetching + caching.
export interface SavedLocation {
  latitude: number;
  longitude: number;
  label: string;
}
