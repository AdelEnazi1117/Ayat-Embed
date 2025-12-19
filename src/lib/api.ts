import type { Surah, Ayah, VerseData, VerseWord } from "@/types";
import {
  validateApiResponse,
  validateAndSanitizeSurah,
  validateAyahStructure,
} from "./sanitize";

// Base URL for the internal proxy
const API_BASE = "/api/quran";

export const MAX_VERSES_LIMIT = 30;

const DEFAULT_MUSHAF = 1; // QCF V2 (recommended / what our QPC V2 page-fonts match)
const DEFAULT_TRANSLATION_ID = 131; // Sahih International

const BASMALA = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

function stripBasmalaFromText(text: string): string {
  const trimmed = text.trimStart();
  if (trimmed.startsWith(BASMALA)) {
    return trimmed.slice(BASMALA.length).trimStart();
  }
  return text;
}

function removeArabicDiacritics(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .normalize("NFC");
}

function decodeHtmlEntities(text: string): string {
  // Minimal decoding (enough for common translation payloads)
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function sanitizeTranslationHtml(raw: string): string {
  if (typeof raw !== "string") return "";
  // Preserve basic spacing when translations include <br> / block tags
  const normalized = raw
    .replace(/<\s*br\s*\/?>/gi, " ")
    .replace(/<\/\s*p\s*>/gi, " ")
    .replace(/<\s*p[^>]*>/gi, " ");

  const stripped = validateApiResponse(normalized);
  return decodeHtmlEntities(stripped).replace(/\s+/g, " ").trim();
}

function buildUnicodeTextFromWords(words: VerseWord[]): string {
  return words
    .filter((w) => w.charTypeName !== "end")
    .map((w) => w.textQpcHafs || "")
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildQcfV2TextFromWords(words: VerseWord[]): string {
  return words
    .filter((w) => w.charTypeName !== "end")
    .map((w) => w.codeV2 || "")
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function maybeStripBasmalaFromWords(words: VerseWord[]): VerseWord[] {
  // Quran.Foundation can include Basmala in 1st verse for many chapters.
  // We want verse content *after* the basmala (except Al-Fatiha).
  if (words.length < 4) return words;

  const basmalaWordsNormalized = removeArabicDiacritics(BASMALA).split(" ");
  const candidate = words
    .slice(0, basmalaWordsNormalized.length)
    .map((w) => removeArabicDiacritics(w.textQpcHafs || ""))
    .filter(Boolean);

  if (candidate.length !== basmalaWordsNormalized.length) return words;

  const matches = candidate.every(
    (w, idx) => w === basmalaWordsNormalized[idx]
  );
  if (!matches) return words;

  return words.slice(basmalaWordsNormalized.length);
}

type QfTranslation = {
  id?: number;
  resource_id?: number;
  text?: string;
};

type QfWord = {
  id?: number;
  position?: number;
  page_number?: number;
  line_number?: number;
  code_v2?: string;
  text_qpc_hafs?: string;
  char_type_name?: string;
  translation?: { text?: string; language_name?: string };
};

type QfVerse = {
  id: number;
  verse_number: number;
  verse_key: string;
  page_number?: number;
  juz_number?: number;
  manzil_number?: number;
  ruku_number?: number;
  hizb_number?: number;
  rub_el_hizb_number?: number;
  sajdah_number?: number | null;
  words?: QfWord[];
  translations?: QfTranslation[];
  // Optional verse-level fields (may or may not be present depending on query)
  text_uthmani?: string;
  text_qpc_v2?: string;
};

type QfVerseByKeyResponse = {
  verse: QfVerse;
};

function pickTranslationText(
  translations: unknown,
  preferredId: number
): string {
  // Quran.Foundation has returned different translation shapes over time.
  // Handle the common cases defensively.
  if (Array.isArray(translations)) {
    const preferred = translations.find((t: unknown) => {
      if (!t || typeof t !== "object") return false;
      const anyT = t as Partial<QfTranslation> & Record<string, unknown>;
      const id = typeof anyT.id === "number" ? anyT.id : undefined;
      const resourceId =
        typeof anyT.resource_id === "number" ? anyT.resource_id : undefined;
      return id === preferredId || resourceId === preferredId;
    }) as Partial<QfTranslation> | undefined;

    const candidate =
      preferred?.text ||
      (translations[0] &&
      typeof (translations[0] as Partial<QfTranslation>).text === "string"
        ? (translations[0] as Partial<QfTranslation>).text
        : "");
    return typeof candidate === "string" ? candidate : "";
  }

  // Sometimes translations come back as an object keyed by id.
  if (translations && typeof translations === "object") {
    const asRecord = translations as Record<string, unknown>;
    const preferredKey = String(preferredId);
    const preferred = asRecord[preferredKey];
    if (preferred && typeof preferred === "object") {
      const text = (preferred as Record<string, unknown>).text;
      return typeof text === "string" ? text : "";
    }
  }

  return "";
}

/**
 * Fetches data from the internal API proxy.
 * The proxy handles authentication with the Quran Foundation API.
 */
async function fetchFromProxy(path: string, options: RequestInit = {}) {
  // Ensure path doesn't start with / to avoid double slashes if API_BASE ends with /
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const url = `${API_BASE}/${cleanPath}`;

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Accept: "application/json",
    },
  });
}

export async function fetchSurahs(): Promise<Surah[]> {
  try {
    const response = await fetchFromProxy("chapters");

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.chapters || !Array.isArray(data.chapters)) {
      throw new Error(`Invalid API response structure`);
    }

    const validatedSurahs: Surah[] = [];

    for (const chapter of data.chapters) {
      const surah: Surah = {
        number: chapter.id,
        name: chapter.name_arabic,
        englishName: chapter.name_simple,
        englishNameTranslation: chapter.translated_name?.name || "",
        numberOfAyahs: chapter.verses_count,
        revelationType:
          chapter.revelation_place === "makkah" ? "Meccan" : "Medinan",
      };

      if (validateAndSanitizeSurah(surah)) {
        validatedSurahs.push(surah);
      }
    }

    if (validatedSurahs.length === 0) {
      throw new Error(`No valid surahs found in API response`);
    }

    return validatedSurahs;
  } catch (error) {
    console.error("Failed to fetch Surahs:", error);
    throw error;
  }
}

async function fetchVerseData(
  surahNumber: number,
  ayahNumber: number
): Promise<VerseData> {
  const verseKey = `${surahNumber}:${ayahNumber}`;

  const params = new URLSearchParams({
    mushaf: String(DEFAULT_MUSHAF),
    words: "true",
    word_fields: "code_v2,text_qpc_hafs,page_number,line_number",
    translations: String(DEFAULT_TRANSLATION_ID),
  });

  const response = await fetchFromProxy(`verses/by_key/${verseKey}?${params}`);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = (await response.json()) as Partial<QfVerseByKeyResponse>;
  if (!data?.verse) {
    throw new Error(`Invalid API response structure`);
  }

  const v = data.verse;

  const rawWords = Array.isArray(v.words) ? v.words : [];
  const mappedWords: VerseWord[] = rawWords
    .map((w): VerseWord | null => {
      const pageNumber =
        typeof w.page_number === "number" && w.page_number > 0
          ? w.page_number
          : typeof v.page_number === "number" && v.page_number > 0
          ? v.page_number
          : 1;

      const codeV2 = typeof w.code_v2 === "string" ? w.code_v2 : undefined;
      const textQpcHafs =
        typeof w.text_qpc_hafs === "string" ? w.text_qpc_hafs : undefined;
      const charTypeName =
        typeof w.char_type_name === "string" ? w.char_type_name : undefined;
      const id = typeof w.id === "number" ? w.id : undefined;
      const position = typeof w.position === "number" ? w.position : undefined;

      // If we have neither glyph nor readable fallback, drop the word.
      if (!codeV2 && !textQpcHafs) return null;

      return { id, position, pageNumber, codeV2, textQpcHafs, charTypeName };
    })
    .filter((w): w is VerseWord => Boolean(w));
  // Keep all word types (including "end") so the UI can render verse-end markers (۝) correctly.

  const words =
    surahNumber !== 1 && ayahNumber === 1
      ? maybeStripBasmalaFromWords(mappedWords)
      : mappedWords;

  const translationRaw = pickTranslationText(
    v.translations as unknown,
    DEFAULT_TRANSLATION_ID
  );

  let translationText = sanitizeTranslationHtml(translationRaw);
  // If verse-level translations are missing, try to build from word-level translations
  if (!translationText) {
    const wordTranslations = rawWords
      .filter(
        (w) =>
          w.char_type_name === "word" &&
          w.translation?.text &&
          typeof w.translation.text === "string"
      )
      .map((w) => w.translation!.text!);
    if (wordTranslations.length > 0) {
      translationText = wordTranslations.join(" ");
    }
  }
  // Fallback: some upstream payloads omit translations even at word level.
  if (!translationText) {
    try {
      translationText = await fetchTranslation(surahNumber, ayahNumber);
    } catch {
      // Ignore; we'll keep translationText empty and the UI will hide it.
    }
  }

  const arabicTextFromWords = buildUnicodeTextFromWords(words);
  const arabicText =
    surahNumber !== 1 && ayahNumber === 1
      ? stripBasmalaFromText(arabicTextFromWords)
      : arabicTextFromWords;

  const arabicTextQpcV2 = buildQcfV2TextFromWords(words) || v.text_qpc_v2;

  const pageNumber =
    (typeof v.page_number === "number" && v.page_number > 0 && v.page_number) ||
    words[0]?.pageNumber ||
    1;

  return {
    number: typeof v.verse_number === "number" ? v.verse_number : ayahNumber,
    arabicText,
    arabicTextQpcV2:
      typeof arabicTextQpcV2 === "string" ? arabicTextQpcV2 : undefined,
    translationText,
    pageNumber,
    words,
  };
}

export async function fetchAyah(
  surahNumber: number,
  ayahNumber: number
): Promise<Ayah> {
  try {
    const verse = await fetchVerseData(surahNumber, ayahNumber);

    // Fetch full metadata (juz/manzil/etc) from the upstream verse payload.
    // We do a lightweight request without words to reduce payload size.
    const response = await fetchFromProxy(
      `verses/by_key/${surahNumber}:${ayahNumber}?mushaf=${DEFAULT_MUSHAF}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = (await response.json()) as Partial<QfVerseByKeyResponse>;
    if (!data?.verse) {
      throw new Error(`Invalid API response structure`);
    }

    const v = data.verse;

    // Map to the Ayah interface expected by the app
    const hizbNumber = typeof v.hizb_number === "number" ? v.hizb_number : 1;
    const rubElHizbNumber =
      typeof v.rub_el_hizb_number === "number" ? v.rub_el_hizb_number : 1;

    const ayah: Ayah = {
      number: v.id,
      text: verse.arabicText,
      text_qpc_v2: verse.arabicTextQpcV2,
      numberInSurah: v.verse_number,
      juz: typeof v.juz_number === "number" ? v.juz_number : 1,
      manzil: typeof v.manzil_number === "number" ? v.manzil_number : 1,
      page:
        typeof v.page_number === "number"
          ? v.page_number
          : verse.pageNumber || 1,
      ruku: typeof v.ruku_number === "number" ? v.ruku_number : 1,
      hizbQuarter: (hizbNumber - 1) * 4 + rubElHizbNumber,
      sajda: v.sajdah_number !== null && v.sajdah_number !== undefined,
    };

    if (!validateAyahStructure(ayah)) {
      throw new Error(`Invalid ayah structure in API response`);
    }

    return { ...ayah, text: validateApiResponse(ayah.text) };
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
    const response = await fetchFromProxy(
      `verses/by_key/${surahNumber}:${ayahNumber}?translations=${DEFAULT_TRANSLATION_ID}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = (await response.json()) as Partial<QfVerseByKeyResponse>;

    if (!data?.verse) {
      throw new Error(`Invalid API response structure`);
    }

    const raw = pickTranslationText(
      data.verse.translations as unknown,
      DEFAULT_TRANSLATION_ID
    );

    return sanitizeTranslationHtml(raw || "");
  } catch (error) {
    console.error("Failed to fetch translation:", error);
    throw error;
  }
}

export async function fetchAyahWithTranslation(
  surahNumber: number,
  ayahNumber: number
): Promise<{ ayah: Ayah; translation: string }> {
  try {
    const [ayah, translation] = await Promise.all([
      fetchAyah(surahNumber, ayahNumber),
      fetchTranslation(surahNumber, ayahNumber),
    ]);
    return { ayah, translation };
  } catch (error) {
    console.error("Failed to fetch Ayah with translation:", error);
    throw error;
  }
}

export async function fetchVersesRange(
  surahNumber: number,
  fromAyah: number,
  toAyah: number
): Promise<VerseData[]> {
  const actualTo = Math.min(toAyah, fromAyah + MAX_VERSES_LIMIT - 1);

  const ayahNumbers = Array.from(
    { length: actualTo - fromAyah + 1 },
    (_, idx) => fromAyah + idx
  );

  const concurrency = 6;
  const results: VerseData[] = new Array(ayahNumbers.length);
  let nextIndex = 0;

  await Promise.all(
    Array.from({ length: Math.min(concurrency, ayahNumbers.length) }).map(
      async () => {
        while (true) {
          const current = nextIndex++;
          if (current >= ayahNumbers.length) return;
          results[current] = await fetchVerseData(
            surahNumber,
            ayahNumbers[current]
          );
        }
      }
    )
  );

  return results;
}
