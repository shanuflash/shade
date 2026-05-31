// Helpers for Open-Meteo's local wall-clock ISO strings ("YYYY-MM-DDTHH:mm").
// With timezone=auto these carry no offset, so we parse the parts directly and
// avoid Date timezone pitfalls. String comparison is valid within one timezone.

export interface LocalTimeParts {
  date: string; // "YYYY-MM-DD"
  hour: number; // 0-23
  minute: number; // 0-59
  minutesOfDay: number;
}

export function parseLocal(iso: string): LocalTimeParts {
  const [date, time = '00:00'] = iso.split('T');
  const [h, m = '0'] = time.split(':');
  const hour = Number(h) || 0;
  const minute = Number(m) || 0;
  return { date, hour, minute, minutesOfDay: hour * 60 + minute };
}

/** The "YYYY-MM-DD" day portion of a local ISO string. */
export function dayOf(iso: string): string {
  return iso.split('T')[0];
}

/** "2 PM", "12 AM", "11 PM" — for hourly chips. */
export function hourLabel(iso: string): string {
  const { hour } = parseLocal(iso);
  const period = hour < 12 ? 'AM' : 'PM';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12} ${period}`;
}

/** "6:42 AM" — for sunrise/sunset which include minutes. */
export function clockLabel(iso: string): string {
  const { hour, minute } = parseLocal(iso);
  const period = hour < 12 ? 'AM' : 'PM';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${String(minute).padStart(2, '0')} ${period}`;
}

/** Signed difference (b - a) in minutes, assuming the same day/timezone. */
export function minutesBetween(a: string, b: string): number {
  return parseLocal(b).minutesOfDay - parseLocal(a).minutesOfDay;
}
