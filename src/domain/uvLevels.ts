// WHO UV index bands and the protection guidance for each.

export type UvCategory = 'low' | 'moderate' | 'high' | 'veryHigh' | 'extreme';

// Hex literal so the widget library's ColorProp accepts these directly.
export type HexColor = `#${string}`;

export interface UvLevel {
  category: UvCategory;
  /** 0-4, used to fill the dot indicators (band N of 5). */
  index: number;
  label: string;
  range: string;
  color: HexColor;
  colorDark: HexColor;
  shortTip: string;
  /** One-word imperative used as the editorial headline. */
  headline: string;
  advice: string[];
}

const LEVELS: UvLevel[] = [
  {
    category: 'low',
    index: 0,
    label: 'Low',
    range: '0-2',
    color: '#3DBE6E',
    colorDark: '#2C9E58',
    shortTip: 'Safe, no protection needed',
    headline: "You're good.",
    advice: [
      'You can safely enjoy time outside.',
      'No sun protection required for most people.',
    ],
  },
  {
    category: 'moderate',
    index: 1,
    label: 'Moderate',
    range: '3-5',
    color: '#F2C200',
    colorDark: '#D6A900',
    shortTip: 'Sunscreen recommended',
    headline: 'Ease in.',
    advice: [
      'Apply SPF 30 sunscreen on exposed skin.',
      'Seek shade around midday.',
      'Wear a hat and sunglasses.',
    ],
  },
  {
    category: 'high',
    index: 2,
    label: 'High',
    range: '6-7',
    color: '#F58518',
    colorDark: '#D86F0C',
    shortTip: 'SPF 30+ and sunglasses',
    headline: 'Cover up.',
    advice: [
      'Use SPF 30+ and reapply every 2 hours.',
      'Wear UV-blocking sunglasses and a hat.',
      'Reduce time in the sun between 10am and 4pm.',
    ],
  },
  {
    category: 'veryHigh',
    index: 3,
    label: 'Very High',
    range: '8-10',
    color: '#EF4444',
    colorDark: '#C9302C',
    shortTip: 'Limit midday exposure',
    headline: 'Take care.',
    advice: [
      'Minimize sun exposure between 10am and 4pm.',
      'Apply SPF 50, reapply often, and cover up.',
      'Seek shade and stay hydrated.',
    ],
  },
  {
    category: 'extreme',
    index: 4,
    label: 'Extreme',
    range: '11+',
    color: '#A855F7',
    colorDark: '#8B3FD6',
    shortTip: 'Avoid direct sun',
    headline: 'Stay in.',
    advice: [
      'Avoid being outside during midday hours.',
      'Shirt, sunscreen, hat and sunglasses are a must.',
      'Unprotected skin can burn in minutes.',
    ],
  },
];

export function uvLevel(uv: number): UvLevel {
  const v = Number.isFinite(uv) ? uv : 0;
  if (v < 3) return LEVELS[0];
  if (v < 6) return LEVELS[1];
  if (v < 8) return LEVELS[2];
  if (v < 11) return LEVELS[3];
  return LEVELS[4];
}

export function isSafeNow(uv: number): boolean {
  return uvLevel(uv).category === 'low';
}
