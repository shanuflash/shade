export interface Palette {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textDim: string;
  textFaint: string;
  border: string;
  accent: string;
  /** Overlay used on top of colored hero areas. */
  onColor: string;
  onColorDim: string;
}

export const darkPalette: Palette = {
  background: '#0B1120',
  surface: '#151D2E',
  surfaceAlt: '#1E283C',
  text: '#F8FAFC',
  textDim: '#9AA6BC',
  textFaint: '#64748B',
  border: '#243049',
  accent: '#60A5FA',
  onColor: '#FFFFFF',
  onColorDim: '#E8EAF0',
};

export const lightPalette: Palette = {
  background: '#F3F6FB',
  surface: '#FFFFFF',
  surfaceAlt: '#EAF0F8',
  text: '#0B1120',
  textDim: '#5B6678',
  textFaint: '#94A3B8',
  border: '#E2E8F0',
  accent: '#2563EB',
  onColor: '#FFFFFF',
  onColorDim: '#F1F5F9',
};
