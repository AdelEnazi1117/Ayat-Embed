export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean };
  surah?: Surah;
}

export interface VerseData {
  number: number;
  arabicText: string;
  translationText: string;
}

export interface ApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

export interface CardStyle {
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  theme: "dark" | "light";
  showTranslation: boolean;
  showReference: boolean;
  showVerseNumbers: boolean;
  showAccentLine: boolean;
  transparentBackground: boolean;
  showBrackets: boolean;
  continuousLines: boolean;
}

export interface ColorPreset {
  name: string;
  value: string;
}

export interface EmbedConfig {
  surah: number;
  fromAyah: number;
  toAyah: number;
  style: CardStyle;
}

export type ExportFormat = "iframe" | "html";
