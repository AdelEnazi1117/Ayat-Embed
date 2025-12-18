import type { Surah, Ayah, VerseData } from "@/types";
import { validateApiResponse, validateAndSanitizeSurah, validateAyahStructure } from "./sanitize";

const API_BASE = "https://api.alquran.cloud/v1";

export const MAX_VERSES_LIMIT = 30;

export async function fetchSurahs(): Promise<Surah[]> {
  try {
    const response = await fetch(`${API_BASE}/surah`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || typeof data !== 'object' || data.code !== 200) {
      throw new Error(`Invalid API response structure`);
    }

    if (!data.data || !Array.isArray(data.data)) {
      throw new Error(`API response data is not an array`);
    }

    const validatedSurahs: Surah[] = [];
    const invalidCount = data.data.length;

    for (const surah of data.data) {
      if (validateAndSanitizeSurah(surah)) {
        validatedSurahs.push(surah as Surah);
      }
    }

    if (validatedSurahs.length === 0) {
      throw new Error(`No valid surahs found in API response`);
    }

    if (validatedSurahs.length < invalidCount) {
      console.warn(`${invalidCount - validatedSurahs.length} surahs were filtered out due to validation failures`);
    }

    return validatedSurahs;
  } catch (error) {
    console.error("Failed to fetch Surahs:", error);
    throw error;
  }
}

export async function fetchAyah(
  surahNumber: number,
  ayahNumber: number
): Promise<Ayah> {
  const BASMALA = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

  const stripBasmala = (text: string) => {
    const trimmed = text.trimStart();
    if (trimmed.startsWith(BASMALA)) {
      return trimmed.slice(BASMALA.length).trimStart();
    }
    return text;
  };

  try {
    const response = await fetch(
      `${API_BASE}/ayah/${surahNumber}:${ayahNumber}/quran-uthmani`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || typeof data !== 'object' || data.code !== 200) {
      throw new Error(`Invalid API response structure`);
    }

    if (!data.data || typeof data.data !== 'object') {
      throw new Error(`API response data is not an object`);
    }

    const ayah = data.data;

    if (!validateAyahStructure(ayah)) {
      throw new Error(`Invalid ayah structure in API response`);
    }

    const validatedText = validateApiResponse(ayah.text);

    // Some editions include the basmala in the first ayah of every surah.
    // We want the first verse content to start *after* the basmala except in Al-Fatiha.
    const sanitizedAyah =
      surahNumber !== 1 && ayah.numberInSurah === 1
        ? { ...ayah, text: stripBasmala(validatedText) }
        : { ...ayah, text: validatedText };

    return sanitizedAyah;
  } catch (error) {
    console.error("Failed to fetch Ayah:", error);
    throw error;
  }
}

export async function fetchTranslation(
  surahNumber: number,
  ayahNumber: number
): Promise<string> {
  try {
    const response = await fetch(
      `${API_BASE}/ayah/${surahNumber}:${ayahNumber}/en.sahih`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || typeof data !== 'object' || data.code !== 200) {
      throw new Error(`Invalid API response structure`);
    }

    if (!data.data || typeof data.data !== 'object') {
      throw new Error(`API response data is not an object`);
    }

    return validateApiResponse(data.data.text);
  } catch (error) {
    console.error("Failed to fetch translation:", error);
    throw error;
  }
}

export async function fetchAyahWithTranslation(
  surahNumber: number,
  ayahNumber: number
): Promise<{ ayah: Ayah; translation: string }> {
  const [ayah, translation] = await Promise.all([
    fetchAyah(surahNumber, ayahNumber),
    fetchTranslation(surahNumber, ayahNumber),
  ]);

  return { ayah, translation };
}

export async function fetchVersesRange(
  surahNumber: number,
  fromAyah: number,
  toAyah: number
): Promise<VerseData[]> {
  const actualTo = Math.min(toAyah, fromAyah + MAX_VERSES_LIMIT - 1);

  const verses: VerseData[] = [];

  const promises = [];
  for (let i = fromAyah; i <= actualTo; i++) {
    promises.push(fetchAyahWithTranslation(surahNumber, i));
  }

  const results = await Promise.all(promises);

  for (let i = 0; i < results.length; i++) {
    verses.push({
      number: fromAyah + i,
      arabicText: results[i].ayah.text,
      translationText: results[i].translation,
    });
  }

  return verses;
}
