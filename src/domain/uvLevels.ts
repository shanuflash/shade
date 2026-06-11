// WHO UV index bands and the tan-prevention guidance for each.
//
// This app is about preventing tan, not just sunburn. Tanning is driven by
// cumulative UV exposure and kicks in well below the sunburn threshold, so the
// guidance below is deliberately stricter than typical weather-app advice. That
// holds for everyone — the goal here is avoiding pigmentation, not just burning.
// It's written for someone who tans readily and wants to minimise it, and assumes
// the user owns a UPF "sunscreen jacket" — the most reliable tan blocker, since it
// stops UV on covered skin entirely rather than just slowing it like sunscreen.
//
// Deliberately no Fitzpatrick phototype: the scale is inconsistent and was built
// around lighter skin (V/VI added years later), so it's a poor basis for this.
// Strictness comes from the tan-prevention goal, with room for a user-adjustable
// sensitivity setting later.

export type UvCategory = 'low' | 'moderate' | 'high' | 'veryHigh' | 'extreme';

// The single most important thing to do right now. Drives the widget glyph.
//  - none:      won't meaningfully tan, no action
//  - sunscreen: SPF on exposed skin
//  - jacket:    UPF jacket on + sunscreen the bits it doesn't cover
//  - shade:     stay out of direct sun
export type ProtectionAction = 'none' | 'sunscreen' | 'jacket' | 'shade';

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
  /** The headline action for this band. */
  action: ProtectionAction;
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
    action: 'none',
    shortTip: 'Low tanning risk',
    headline: "You're clear.",
    advice: [
      'Low tanning risk — short spells uncovered are fine.',
      'Only long sessions add up here; no cover-up needed otherwise.',
    ],
  },
  {
    category: 'moderate',
    index: 1,
    label: 'Moderate',
    range: '3-5',
    color: '#F2C200',
    colorDark: '#D6A900',
    action: 'sunscreen',
    shortTip: 'Sunscreen exposed skin',
    headline: 'Screen up.',
    advice: [
      'Enough UV to slowly tan — put SPF 30+ on exposed skin.',
      'Out for more than a short while? Throw the jacket on.',
      'A cap shades your face, the part sunscreen misses most.',
    ],
  },
  {
    category: 'high',
    index: 2,
    label: 'High',
    range: '6-7',
    color: '#F58518',
    colorDark: '#D86F0C',
    action: 'jacket',
    shortTip: 'Jacket on, screen the rest',
    headline: 'Jacket on.',
    advice: [
      'You will tan at this UV — wear the UPF jacket.',
      'Sunscreen the bits it leaves out: face, neck, hands.',
      'Keep out of direct sun between 10am and 4pm.',
    ],
  },
  {
    category: 'veryHigh',
    index: 3,
    label: 'Very High',
    range: '8-10',
    color: '#EF4444',
    colorDark: '#C9302C',
    action: 'jacket',
    shortTip: 'Jacket + shade midday',
    headline: 'Stay covered.',
    advice: [
      'Skin tans fast now — jacket on and SPF 50 on the rest.',
      'Stick to shade between 10am and 4pm where you can.',
      'Reapply sunscreen on face and hands every couple of hours.',
    ],
  },
  {
    category: 'extreme',
    index: 4,
    label: 'Extreme',
    range: '11+',
    color: '#A855F7',
    colorDark: '#8B3FD6',
    action: 'shade',
    shortTip: 'Stay out of direct sun',
    headline: 'Seek shade.',
    advice: [
      'Avoid direct sun — skin tans, and burns, in minutes.',
      'If you must be out: jacket, cap, sunglasses, SPF 50.',
      'Indoors or full shade is the only sure way to not tan.',
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

// "Safe" here means safe from tanning, not just from burning: only the low band
// is low enough that cumulative exposure won't noticeably tan type IV skin.
export function isSafeNow(uv: number): boolean {
  return uvLevel(uv).category === 'low';
}
