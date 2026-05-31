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
  start: string;
  end: string;
  startLabel: string;
  endLabel: string;
}

export interface Recommendation {
  level: UvLevel;
  safeNow: boolean;
  tips: ContextTip[];
  safeWindows: SafeWindow[];
}

const LOW_UV = 3;

// Contiguous daylight hours where UV stays in the low band (typically early
// morning and late afternoon).
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

  // Drop windows that have already fully passed.
  return windows.filter((w) => w.end.slice(0, 13) >= nowHourKey).slice(0, 2);
}

export function buildRecommendation(forecast: Forecast): Recommendation {
  const level = uvLevel(forecast.currentUv);
  const safeNow = isSafeNow(forecast.currentUv);
  const tips: ContextTip[] = [];
  const today = dayOf(forecast.currentTime);

  // High UV even under heavy cloud cover.
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
      )}% cloud cover. Clouds don't block all UV.`,
    });
  }

  // UV easing as sunset approaches.
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

  // Peak UV still ahead today.
  if (
    forecast.todayPeakTime &&
    forecast.todayPeakTime.slice(0, 13) > forecast.currentTime.slice(0, 13) &&
    forecast.todayMaxUv >= 6
  ) {
    tips.push({
      id: 'peak',
      icon: 'trending-up-outline',
      text: `Peak UV of ${Math.round(forecast.todayMaxUv)} around ${hourLabel(
        forecast.todayPeakTime,
      )}. Limit sun exposure then.`,
    });
  }

  // Outdoor suggestion based on safe windows.
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
      text: `Safer outdoors ${w.startLabel} to ${w.endLabel} when UV is low.`,
    });
  }

  return { level, safeNow, tips, safeWindows };
}
