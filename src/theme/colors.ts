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

// Pure black, white text, one warm sun accent. A sleek, editorial, OLED look.
export const darkPalette: Palette = {
  background: '#000000',
  surface: '#0E0E10',
  surfaceAlt: '#161618',
  text: '#F4F4F6',
  textDim: '#7D7D85',
  textFaint: '#4A4A52',
  border: '#1C1C20',
  accent: '#FF7A1A',
  dotEmpty: '#2C2C31',
  onColor: '#FFFFFF',
  onColorDim: '#E8EAF0',
};

export const lightPalette: Palette = {
  background: '#FFFFFF',
  surface: '#F6F6F7',
  surfaceAlt: '#ECECEE',
  text: '#0A0A0B',
  textDim: '#6B6B73',
  textFaint: '#A0A0A8',
  border: '#E6E6E9',
  accent: '#EB6A05',
  dotEmpty: '#D3D7DE',
  onColor: '#FFFFFF',
  onColorDim: '#F1F5F9',
};
