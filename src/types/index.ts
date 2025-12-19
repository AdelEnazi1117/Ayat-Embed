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
  text_qpc_v2?: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean };
  surah?: Surah;
}

export interface VerseWord {
  /** Word id from Quran.Foundation (if provided) */
  id?: number;
  /** Word position within the verse (if provided) */
  position?: number;
  /** Mushaf page number (1-604 for QCF V2) */
  pageNumber: number;
  /** QCF V2 glyph code (may be a literal glyph or an HTML entity string) */
  codeV2?: string;
  /** Unicode fallback text (QPC Hafs) */
  textQpcHafs?: string;
  /** word | end | pause | sajdah | rub-el-hizb | ... */
  charTypeName?: string;
}

export interface VerseData {
  number: number;
  arabicText: string;
  arabicTextQpcV2?: string;
  translationText: string;
  pageNumber?: number;
  /**
   * Word-level data for accurate QCF rendering.
   * Needed because a single verse can span multiple Mushaf pages.
   */
  words?: VerseWord[];
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
