export interface Palette {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textDim: string;
  textFaint: string;
  border: string;
  accent: string;
  /** Color of an unfilled dot in dot indicators. */
  dotEmpty: string;
  onColor: string;
  onColorDim: string;
}

// Near-black surfaces, white text, a single red accent. Matches a minimal,
// monochrome home screen.
export const darkPalette: Palette = {
  background: '#0A0A0B',
  surface: '#151517',
  surfaceAlt: '#222226',
  text: '#F4F4F5',
  textDim: '#9B9BA1',
  textFaint: '#5B5B61',
  border: '#26262A',
  accent: '#FF3B30',
  dotEmpty: '#34343A',
  onColor: '#FFFFFF',
  onColorDim: '#E8EAF0',
};

export const lightPalette: Palette = {
  background: '#F3F4F6',
  surface: '#FFFFFF',
  surfaceAlt: '#E9EBEF',
  text: '#0A0A0B',
  textDim: '#5B6072',
  textFaint: '#9499A6',
  border: '#E2E5EA',
  accent: '#E5342B',
  dotEmpty: '#D3D7DE',
  onColor: '#FFFFFF',
  onColorDim: '#F1F5F9',
};
