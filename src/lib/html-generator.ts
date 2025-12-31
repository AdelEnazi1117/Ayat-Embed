import type { CardStyle, VerseData } from "@/types";
import { escapeHtml } from "./sanitize";
import { formatReference } from "./verse-formatter";

export function generateStaticHTML(
  verses: VerseData[],
  surahName: string,
  surahNameArabic: string,
  surahNumber: number,
  style: CardStyle,
  isArabicUI: boolean = false
): string {
  const {
    accentColor,
    backgroundColor,
    textColor,
    showTranslation,
    showReference,
    showVerseNumbers,
    showAccentLine,
    transparentBackground,
    showBrackets = true,
  } = style;
  const continuousLines = verses.length > 1;

  const finalBgColor = transparentBackground ? "transparent" : backgroundColor;
  const finalTextColor = textColor;

  const parseBorderColor = (hex: string) => {
    if (!/^#([A-Fa-f0-9]{6})$/.test(hex)) {
      return "rgba(255,255,255,0.1)";
    }
    const value = parseInt(hex.slice(1), 16);
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;
    return `rgba(${r},${g},${b},0.1)`;
  };

  const borderColor = parseBorderColor(finalTextColor);

  const fromAyah = verses.length > 0 ? verses[0].number : 1;
  const toAyah = verses.length > 0 ? verses[verses.length - 1].number : 1;
  const isRange = verses.length > 1;
  const wrapRangeWithBrackets = showBrackets && isRange;
  const showBracketsPerVerse = showBrackets && !wrapRangeWithBrackets;

  const referenceText = formatReference(
    surahName,
    surahNameArabic,
    surahNumber,
    fromAyah,
    toAyah,
    isArabicUI
  );

  const sanitizeGlyphHtml = (glyph: string) => {
    // We intentionally allow HTML entities (e.g. &#xFxxx;) to be interpreted,
    // but never allow raw HTML tags.
    if (glyph.length > 2000) return "";
    return /[<>]/.test(glyph) ? escapeHtml(glyph) : glyph;
  };

  const getVerseArabicHtml = (verse: VerseData) => {
    if (Array.isArray(verse.words) && verse.words.length > 0) {
      return verse.words
        .filter((w) => (showVerseNumbers ? true : w.charTypeName !== "end"))
        .map((w) => {
          if (w.charTypeName === "end") {
            const marker = escapeHtml(w.textQpcHafs || "۝");
            return `<span style="font-family: 'UthmanicHafs', serif; color: ${accentColor};">${marker}</span>`;
          }

          const content = w.codeV2
            ? sanitizeGlyphHtml(w.codeV2)
            : escapeHtml(w.textQpcHafs || "");

          const fontStyle = w.codeV2
            ? `font-family: "QPC Mushaf Page ${w.pageNumber}";`
            : "";

          return `<span style="${fontStyle}">${content}</span>`;
        })
        .join(" ");
    }

    const fallbackText = escapeHtml(verse.arabicTextQpcV2 || verse.arabicText);
    const page = typeof verse.pageNumber === "number" ? verse.pageNumber : 1;
    return `<span style="font-family: 'QPC Mushaf Page ${page}'">${fallbackText}</span>`;
  };

  const uniquePages = Array.from(
    new Set(
      verses.flatMap((v) =>
        Array.isArray(v.words) && v.words.length > 0
          ? v.words.map((w) => w.pageNumber)
          : typeof v.pageNumber === "number"
          ? [v.pageNumber]
          : []
      )
    )
  )
    .filter((p) => Number.isFinite(p) && p > 0)
    .sort((a, b) => a - b);

  const qcfFontFaces = uniquePages
    .map(
      (page) => `
@font-face {
  font-family: "QPC Mushaf Page ${page}";
  src: url("https://verses.quran.foundation/fonts/quran/hafs/v2/woff2/p${page}.woff2") format("woff2");
  font-display: swap;
}`
    )
    .join("\n");

  const uthmanicHafsFontFace = `
@font-face {
  font-family: "UthmanicHafs";
  src: url("https://verses.quran.foundation/fonts/quran/hafs/uthmanic_hafs/UthmanicHafs1Ver18.woff2") format("woff2");
  font-display: swap;
}`;

  let versesHtml = "";

  if (continuousLines) {
    const braceStyle = `color: ${accentColor}; font-size: 1.5rem; font-family: 'Amiri Quran', 'UthmanicHafs', serif;`;
    const perVerseOpen = showBracketsPerVerse
      ? `<span style="${braceStyle}">﴿</span>`
      : "";
    const perVerseClose = showBracketsPerVerse
      ? `<span style="${braceStyle}">﴾</span>`
      : "";
    const rangeOpen = wrapRangeWithBrackets
      ? `<span style="${braceStyle}">﴿</span>`
      : "";
    const rangeClose = wrapRangeWithBrackets
      ? `<span style="${braceStyle}">﴾</span>`
      : "";

    const arabicContent = verses
      .map(
        (verse) => `${perVerseOpen}${getVerseArabicHtml(verse)}${perVerseClose}`
      )
      .join(" ");
    const wrappedArabicContent = `${rangeOpen}${arabicContent}${rangeClose}`;

    versesHtml = `
    <p style="
      font-size: 2rem;
      line-height: 2;
      direction: rtl;
      text-align: right;
      margin: 0;
    ">
      ${wrappedArabicContent}
    </p>`;

    if (showTranslation) {
      const translationContent = verses
        .map((verse) => {
          const verseNumInTranslation = showVerseNumbers
            ? `<span style="opacity: 0.5; font-size: 0.875rem; margin-right: 4px;">(${verse.number})</span>`
            : "";
          return `${verseNumInTranslation}${escapeHtml(verse.translationText)}`;
        })
        .join(" ");

      versesHtml += `
      <p style="
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 1rem;
        line-height: 1.6;
        opacity: 0.9;
        margin: 16px 0 0 0;
        padding-top: 16px;
        border-top: 1px solid ${borderColor};
        text-align: left;
      ">
        ${translationContent}
      </p>`;
    }
  } else {
    versesHtml = verses
      .map((verse, index) => {
        const braceStyle = `color: ${accentColor}; font-size: 1.5rem; font-family: 'Amiri Quran', 'UthmanicHafs', serif;`;
        const isFirst = index === 0;
        const isLast = index === verses.length - 1;

        const openBrace = showBracketsPerVerse
          ? `<span style="${braceStyle}">﴿</span>`
          : wrapRangeWithBrackets && isFirst
          ? `<span style="${braceStyle}">﴿</span>`
          : "";

        const closeBrace = showBracketsPerVerse
          ? `<span style="${braceStyle}">﴾</span>`
          : wrapRangeWithBrackets && isLast
          ? `<span style="${braceStyle}">﴾</span>`
          : "";
        const verseNumInTranslation = showVerseNumbers
          ? `<span style="opacity: 0.5; font-size: 0.875rem; margin-right: 8px;">(${verse.number})</span>`
          : "";

        return `
    <p style="
      font-size: 2rem;
      line-height: 2;
      direction: rtl;
      text-align: right;
      margin: 0 0 ${showTranslation ? "8px" : "0"};
    ">
      ${openBrace}${getVerseArabicHtml(verse)}${closeBrace}
    </p>
    ${
      showTranslation && verse.translationText
        ? `
    <p style="
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 1rem;
      line-height: 1.6;
      opacity: 0.9;
      margin: 0;
      padding: 8px 0 ${index < verses.length - 1 ? "16px" : "0"};
      ${
        index < verses.length - 1
          ? `border-bottom: 1px solid ${borderColor}; margin-bottom: 16px;`
          : ""
      }
      text-align: left;
    ">
      ${verseNumInTranslation}
      ${escapeHtml(verse.translationText)}
    </p>
    `
        : ""
    }`;
      })
      .join("\n");
  }

  const accentLineHtml = showAccentLine
    ? `
  <div style="
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 6px;
    background-color: ${accentColor};
    border-radius: 0 8px 8px 0;
  "></div>`
    : "";

  return `<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
${uthmanicHafsFontFace}
${qcfFontFaces}
</style>

<div style="
  font-family: 'Inter', system-ui, sans-serif;
  background-color: ${finalBgColor};
  color: ${finalTextColor};
  padding: 24px 32px;
  border-radius: 16px;
  position: relative;
  box-sizing: border-box;
  max-width: 100%;
  direction: ltr;
">
  ${accentLineHtml}

  ${versesHtml}

  ${
    showReference
      ? `
  <div style="
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
  ">
    <span style="
      font-family: 'Inter', system-ui, sans-serif;
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.875rem;
      background-color: ${accentColor}20;
      color: ${accentColor};
      font-weight: 500;
    ">
      📖 ${referenceText}
    </span>
  </div>
  `
      : ""
  }
</div>`;
}
