import type { VerseWord } from "@/types";

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

/**
 * Maps Quran Foundation API word objects to internal VerseWord format
 * @param rawWords - Array of QfWord objects from API
 * @param versePageNumber - Optional page number from verse level
 * @returns Array of mapped VerseWord objects
 */
export function mapQfWordsToVerseWords(
  rawWords: QfWord[],
  versePageNumber?: number
): VerseWord[] {
  return rawWords
    .map((w): VerseWord | null => {
      const pageNumber =
        typeof w.page_number === "number" && w.page_number > 0
          ? w.page_number
          : typeof versePageNumber === "number" && versePageNumber > 0
          ? versePageNumber
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
}
