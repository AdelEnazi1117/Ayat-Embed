/**
 * Formats verse reference for display
 * @param surahName - English surah name
 * @param surahNameArabic - Arabic surah name
 * @param surahNumber - Surah number
 * @param fromAyah - Starting verse number
 * @param toAyah - Ending verse number
 * @param isArabicUI - Whether to display in Arabic
 * @returns Formatted reference string
 */
export function formatReference(
  surahName: string,
  surahNameArabic: string,
  surahNumber: number,
  fromAyah: number,
  toAyah: number,
  isArabicUI: boolean
): string {
  const isSingleVerse = fromAyah === toAyah;

  if (isArabicUI) {
    const fromArabic = fromAyah.toLocaleString("ar-EG");
    const toArabic = toAyah.toLocaleString("ar-EG");
    if (isSingleVerse) {
      return `${surahNameArabic} (${fromArabic})`;
    }
    return `${surahNameArabic} (${fromArabic}-${toArabic})`;
  }

  if (isSingleVerse) {
    return `${surahName} (${surahNumber}:${fromAyah})`;
  }
  return `${surahName} (${surahNumber}:${fromAyah}-${toAyah})`;
}
