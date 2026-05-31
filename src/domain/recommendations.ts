import type { Forecast, HourlyPoint } from '../api/types';
import { clockLabel, dayOf, hourLabel, minutesBetween, parseLocal } from '../utils/time';
import { isSafeNow, uvLevel, type UvLevel } from './uvLevels';

export interface ContextTip {
  id: string;
  /** Ionicons icon name. */
  icon: string;
  text: string;
}

export interface SafeWindow {
  start: string; // local ISO
  end: string; // local ISO
  startLabel: string;
  endLabel: string;
}

export interface Recommendation {
  level: UvLevel;
  safeNow: boolean;
  tips: ContextTip[];
  safeWindows: SafeWindow[];
}

const LOW_UV = 3; // below this = "low" band

/**
 * Find contiguous daylight hours where UV stays in the low band — genuinely
 * safer windows to be outside (typically morning and late afternoon).
 */
export function findSafeWindows(forecast: Forecast): SafeWindow[] {
  const { todayHourly, sunrise, sunset, currentTime } = forecast;
  if (!sunrise || !sunset) return [];

  const sunriseMin = parseLocal(sunrise).minutesOfDay;
  const sunsetMin = parseLocal(sunset).minutesOfDay;
  const nowHourKey = currentTime.slice(0, 13);

  const windows: SafeWindow[] = [];
  let run: HourlyPoint[] = [];

  const flush = () => {
    if (run.length >= 2) {
      const first = run[0];
      const last = run[run.length - 1];
      windows.push({
        start: first.time,
        end: last.time,
        startLabel: hourLabel(first.time),
        endLabel: hourLabel(last.time),
      });
    }
    run = [];
  };

  for (const p of todayHourly) {
    const min = parseLocal(p.time).minutesOfDay;
    const inDaylight = min >= sunriseMin && min <= sunsetMin;
    if (inDaylight && p.uv < LOW_UV) {
      run.push(p);
    } else {
      flush();
    }
  }
  flush();

  // Only surface windows that haven't fully passed yet.
  return windows.filter((w) => w.end.slice(0, 13) >= nowHourKey).slice(0, 2);
}

/** Build the full set of context-aware tips for the current forecast. */
export function buildRecommendation(forecast: Forecast): Recommendation {
  const level = uvLevel(forecast.currentUv);
  const safeNow = isSafeNow(forecast.currentUv);
  const tips: ContextTip[] = [];
  const today = dayOf(forecast.currentTime);

  // 1. High UV despite cloud cover.
  if (
    forecast.currentUv >= LOW_UV &&
    forecast.currentCloudCover != null &&
    forecast.currentCloudCover >= 50
  ) {
    tips.push({
      id: 'clouds',
      icon: 'cloud-outline',
      text: `UV is still ${level.label.toLowerCase()} despite ${Math.round(
        forecast.currentCloudCover,
      )}% cloud cover — clouds don't block all UV.`,
    });
  }

  // 2. UV dropping as sunset approaches.
  if (forecast.sunset && dayOf(forecast.sunset) === today) {
    const toSunset = minutesBetween(forecast.currentTime, forecast.sunset);
    if (toSunset > 0 && toSunset <= 150 && forecast.currentUv >= LOW_UV) {
      tips.push({
        id: 'sunset',
        icon: 'partly-sunny-outline',
        text: `UV is easing off as sunset nears at ${clockLabel(forecast.sunset)}.`,
      });
    }
  }

  // 3. Peak UV ahead — plan around it.
  if (
    forecast.todayPeakTime &&
    forecast.todayPeakTime.slice(0, 13) > forecast.currentTime.slice(0, 13) &&
    forecast.todayMaxUv >= 6
  ) {
    tips.push({
      id: 'peak',
      icon: 'trending-up-outline',
      text: `Peak UV of ${Math.round(forecast.todayMaxUv)} expected around ${hourLabel(
        forecast.todayPeakTime,
      )} — limit sun exposure then.`,
    });
  }

  // 4. Outdoor activity suggestion based on safe windows.
  const safeWindows = findSafeWindows(forecast);
  if (safeNow) {
    tips.push({
      id: 'outdoor-now',
      icon: 'walk-outline',
      text: 'Great time for outdoor activities right now.',
    });
  } else if (safeWindows.length > 0) {
    const w = safeWindows[0];
    tips.push({
      id: 'outdoor-window',
      icon: 'time-outline',
      text: `Safer outdoors ${w.startLabel}–${w.endLabel} when UV is low.`,
    });
  }

  return { level, safeNow, tips, safeWindows };
}
