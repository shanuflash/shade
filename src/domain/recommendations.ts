import type { Forecast, HourlyPoint } from '../api/types';
import { clockLabel, dayOf, hourLabel, minutesBetween, parseLocal } from '../utils/time';
import { effectiveUv, tanningFactor, type Surroundings } from './tanning';
import { isSafeNow, uvLevel, type UvLevel } from './uvLevels';

const SURROUNDINGS_LABEL: Record<Surroundings, string> = {
  open: 'open ground',
  sand: 'sand',
  water: 'water',
  snow: 'snow',
};

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
  /** Raw measured UV index (the honest number to display). */
  rawUv: number;
  /** UV adjusted for altitude + surroundings — what drives the level and tips. */
  effectiveUv: number;
  tips: ContextTip[];
  safeWindows: SafeWindow[];
}

const LOW_UV = 3;

// Contiguous daylight hours where the effective UV stays in the low band
// (typically early morning and late afternoon). `factor` scales each hour's raw
// UV for altitude/surroundings so reflective conditions shrink the safe windows.
export function findSafeWindows(forecast: Forecast, factor = 1): SafeWindow[] {
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
    if (inDaylight && p.uv * factor < LOW_UV) {
      run.push(p);
    } else {
      flush();
    }
  }
  flush();

  // Drop windows that have already fully passed.
  return windows.filter((w) => w.end.slice(0, 13) >= nowHourKey).slice(0, 2);
}

export function buildRecommendation(
  forecast: Forecast,
  surroundings: Surroundings = 'open',
): Recommendation {
  const rawUv = forecast.currentUv;
  const factor = tanningFactor(forecast.elevation, surroundings);
  const effUv = effectiveUv(rawUv, forecast.elevation, surroundings);

  // The level and "safe" verdict track the effective tanning load, not the raw
  // index — that's the whole point of the adjustment.
  const level = uvLevel(effUv);
  const safeNow = isSafeNow(effUv);
  const tips: ContextTip[] = [];
  const today = dayOf(forecast.currentTime);

  // Reflective surroundings / altitude pushing the load into a higher band than
  // the raw number suggests. Lead with this so the mismatch is explained.
  if (Math.round(effUv) > Math.round(rawUv) && effUv >= LOW_UV) {
    tips.push({
      id: 'amplified',
      icon: 'flag-outline',
      text: `On ${SURROUNDINGS_LABEL[surroundings]}${
        forecast.elevation >= 1000 ? ' at altitude' : ''
      }, reflected UV pushes this closer to UV ${Math.round(effUv)} for tanning.`,
    });
  }

  // At high UV even a short stint tans skin that tans easily, so don't let a quick
  // errand feel "free" the way it genuinely is at low/moderate UV.
  if (effUv >= 6) {
    tips.push({
      id: 'quick',
      icon: 'timer-outline',
      text: 'Even 15–20 min counts now — cover up for anything past a quick dash.',
    });
  }

  // High effective UV even under heavy cloud cover.
  if (
    effUv >= LOW_UV &&
    forecast.currentCloudCover != null &&
    forecast.currentCloudCover >= 50
  ) {
    tips.push({
      id: 'clouds',
      icon: 'cloud-outline',
      text: `Still ${level.label.toLowerCase()} under ${Math.round(
        forecast.currentCloudCover,
      )}% cloud. Clouds cut the burning UV but let UVA — which tans you — through.`,
    });
  }

  // UV easing as sunset approaches.
  if (forecast.sunset && dayOf(forecast.sunset) === today) {
    const toSunset = minutesBetween(forecast.currentTime, forecast.sunset);
    if (toSunset > 0 && toSunset <= 150 && effUv >= LOW_UV) {
      tips.push({
        id: 'sunset',
        icon: 'partly-sunny-outline',
        text: `UV is easing off as sunset nears at ${clockLabel(forecast.sunset)}.`,
      });
    }
  }

  // Peak UV still ahead today (peak is shown adjusted to match the rest).
  const peakEff = forecast.todayMaxUv * factor;
  if (
    forecast.todayPeakTime &&
    forecast.todayPeakTime.slice(0, 13) > forecast.currentTime.slice(0, 13) &&
    peakEff >= 6
  ) {
    tips.push({
      id: 'peak',
      icon: 'trending-up-outline',
      text: `Peak UV of ${Math.round(peakEff)} around ${hourLabel(
        forecast.todayPeakTime,
      )}. Keep the jacket on through then.`,
    });
  }

  // Outdoor suggestion based on safe windows.
  const safeWindows = findSafeWindows(forecast, factor);
  if (safeNow) {
    tips.push({
      id: 'outdoor-now',
      icon: 'walk-outline',
      text: 'UV is low — fine to be out uncovered right now.',
    });
  } else if (safeWindows.length > 0) {
    const w = safeWindows[0];
    tips.push({
      id: 'outdoor-window',
      icon: 'time-outline',
      text: `UV stays low ${w.startLabel} to ${w.endLabel} — best window to be out without the jacket.`,
    });
  }

  return { level, safeNow, rawUv, effectiveUv: effUv, tips, safeWindows };
}
