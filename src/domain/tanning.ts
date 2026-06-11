// Turns the raw erythemal UV index into an "effective tanning load" using the
// measurable factors the UV index leaves out.
//
// The UV index is (a) erythema/sunburn-weighted and (b) computed for a flat, open
// surface. Two things it ignores demonstrably raise the UV dose your skin actually
// receives, and both are measurable:
//   - Altitude: thinner air and less ozone overhead — roughly +10% per 1000 m.
//   - Reflective ground (albedo): snow, sand and water bounce extra UV up at you,
//     adding to the direct beam. Snow is by far the biggest.
// We can't measure UVA or visible light (the true tanning drivers) from a free
// forecast, so this stays a deliberately conservative adjustment, not a claim of
// precision — see AGENTS notes and the research in the project history.

export type Surroundings = 'open' | 'sand' | 'water' | 'snow';

// Extra UV per 1000 m of altitude. ~10%/km is the commonly cited figure.
const ALTITUDE_PER_KM = 0.1;
// Don't let a stray elevation reading inflate the estimate without bound.
const MAX_ALTITUDE_M = 5000;

// Reflected-UV multiplier on the horizontal-surface UV index. These sit at the
// conservative end of published UV-albedo ranges (fresh snow can reflect ~80-90%,
// but real exposure rarely doubles, so snow is capped well below that).
const ALBEDO_FACTOR: Record<Surroundings, number> = {
  open: 1.0,
  sand: 1.15,
  water: 1.1,
  snow: 1.6,
};

export function altitudeFactor(elevationM: number): number {
  if (!Number.isFinite(elevationM) || elevationM <= 0) return 1;
  return 1 + (ALTITUDE_PER_KM * Math.min(elevationM, MAX_ALTITUDE_M)) / 1000;
}

/** Combined multiplier from altitude and surroundings. 1.0 means no adjustment. */
export function tanningFactor(elevationM: number, surroundings: Surroundings): number {
  return altitudeFactor(elevationM) * (ALBEDO_FACTOR[surroundings] ?? 1);
}

/** Raw UV index adjusted for altitude and reflective surroundings. */
export function effectiveUv(
  rawUv: number,
  elevationM: number,
  surroundings: Surroundings,
): number {
  const v = Number.isFinite(rawUv) ? Math.max(0, rawUv) : 0;
  return v * tanningFactor(elevationM, surroundings);
}
