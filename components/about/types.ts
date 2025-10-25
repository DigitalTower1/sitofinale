export interface AboutChapterVisualPalette {
  background: string;
  accent: string;
  ambient: string;
  fog: string;
  fill: string;
}

export type AboutChapterPattern = 'ripple' | 'helix' | 'pillar' | 'nebula';

export interface AboutChapterVisual {
  palette: AboutChapterVisualPalette;
  pattern: AboutChapterPattern;
  warp: number;
  density: number;
  elevation: number;
  drift: number;
}

export interface AboutChapterContent {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
  highlights: string[];
}

export interface AboutChapter extends AboutChapterContent {
  visual: AboutChapterVisual;
}
