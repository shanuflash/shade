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

// Pure black, white text, one risk-colored accent. A calm, monochrome,
// Nothing-inspired look.
export const darkPalette: Palette = {
  background: '#000000',
  surface: '#0F0F10',
  surfaceAlt: '#1B1B1E',
  text: '#F4F4F5',
  textDim: '#8A8A8E',
  textFaint: '#4C4C50',
  border: '#222226',
  accent: '#FF3B30',
  dotEmpty: '#2C2C31',
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
