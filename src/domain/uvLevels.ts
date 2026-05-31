// WHO-aligned UV index bands mapped to the protection guidance in the spec.

export type UvCategory = 'low' | 'moderate' | 'high' | 'veryHigh' | 'extreme';

/** Hex color literal, compatible with react-native-android-widget's ColorProp. */
export type HexColor = `#${string}`;

export interface UvLevel {
  category: UvCategory;
  /** Short human label, e.g. "Low". */
  label: string;
  /** Display range, e.g. "0–2". */
  range: string;
  /** Risk color (used for gauges, widget background, badges). */
  color: HexColor;
  /** A darker shade for gradients / pressed states. */
  colorDark: HexColor;
  /** One-line tip suitable for the compact widget. */
  shortTip: string;
  /** Detailed protection bullets for the recommendation card. */
  advice: string[];
}

const LEVELS: UvLevel[] = [
  {
    category: 'low',
    label: 'Low',
    range: '0–2',
    color: '#3DBE6E',
    colorDark: '#2C9E58',
    shortTip: 'Safe — no protection needed',
    advice: [
      'You can safely enjoy time outside.',
      'No sun protection required for most people.',
    ],
  },
  {
    category: 'moderate',
    label: 'Moderate',
    range: '3–5',
    color: '#F2C200',
    colorDark: '#D6A900',
    shortTip: 'Sunscreen recommended',
    advice: [
      'Apply SPF 30 sunscreen on exposed skin.',
      'Seek shade around midday.',
      'Wear a hat and sunglasses.',
    ],
  },
  {
    category: 'high',
    label: 'High',
    range: '6–7',
    color: '#F58518',
    colorDark: '#D86F0C',
    shortTip: 'SPF 30+ & sunglasses',
    advice: [
      'Use SPF 30+ and reapply every 2 hours.',
      'Wear UV-blocking sunglasses and a hat.',
      'Reduce time in the sun between 10am and 4pm.',
    ],
  },
  {
    category: 'veryHigh',
    label: 'Very High',
    range: '8–10',
    color: '#EF4444',
    colorDark: '#C9302C',
    shortTip: 'Limit midday exposure',
    advice: [
      'Minimize sun exposure between 10am and 4pm.',
      'Apply SPF 50, reapply often, and cover up.',
      'Seek shade and stay hydrated.',
    ],
  },
  {
    category: 'extreme',
    label: 'Extreme',
    range: '11+',
    color: '#A855F7',
    colorDark: '#8B3FD6',
    shortTip: 'Avoid direct sun',
    advice: [
      'Avoid being outside during midday hours.',
      'Shirt, sunscreen, hat and sunglasses are a must.',
      'Unprotected skin can burn in minutes.',
    ],
  },
];

/** Map a UV index value to its risk band. */
export function uvLevel(uv: number): UvLevel {
  const v = Number.isFinite(uv) ? uv : 0;
  if (v < 3) return LEVELS[0];
  if (v < 6) return LEVELS[1];
  if (v < 8) return LEVELS[2];
  if (v < 11) return LEVELS[3];
  return LEVELS[4];
}

/** True when the current UV is low enough that no protection is needed. */
export function isSafeNow(uv: number): boolean {
  return uvLevel(uv).category === 'low';
}
