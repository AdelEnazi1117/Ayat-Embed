"use client";

import React, { useEffect, useMemo } from "react";
import type { CardStyle, VerseData } from "@/types";
import { escapeHtml } from "@/lib/sanitize";
import { ensureQpcV2FontsLoaded } from "@/lib/quranFonts";

interface QuranCardProps {
  verses: VerseData[];
  surahName: string;
  surahNameArabic: string;
  surahNumber: number;
  style: CardStyle;
  isLoading?: boolean;
  isArabicUI?: boolean;
}

export default function QuranCard({
  verses,
  surahName,
  surahNameArabic,
  surahNumber,
  style,
  isLoading = false,
  isArabicUI = false,
}: QuranCardProps) {
  const {
    accentColor,
    backgroundColor,
    textColor = "#ffffff",
    showTranslation,
    showReference,
    showVerseNumbers,
    showAccentLine = true,
    transparentBackground = false,
    showBrackets = true,
    continuousLines = false,
  } = style;

  const isDark = isColorDark(backgroundColor);

  const pagesToLoad = useMemo(() => {
    const pages = new Set<number>();
    for (const v of verses) {
      if (Array.isArray(v.words)) {
        for (const w of v.words) pages.add(w.pageNumber);
      } else if (typeof v.pageNumber === "number") {
        pages.add(v.pageNumber);
      }
    }
    return Array.from(pages);
  }, [verses]);

  useEffect(() => {
    ensureQpcV2FontsLoaded(pagesToLoad);
  }, [pagesToLoad]);

  const cardClasses = [
    "quran-card",
    showAccentLine && "show-accent-line",
    transparentBackground && "transparent-bg",
  ]
    .filter(Boolean)
    .join(" ");

  const cardStyle = {
    "--accent-color": accentColor,
    backgroundColor: transparentBackground ? "transparent" : backgroundColor,
    color: textColor,
  } as React.CSSProperties;

  const fromAyah = verses.length > 0 ? verses[0].number : 1;
  const toAyah = verses.length > 0 ? verses[verses.length - 1].number : 1;
  const isSingleVerse = fromAyah === toAyah;
  const isRange = verses.length > 1;
  const wrapRangeWithBrackets = showBrackets && isRange;
  const showBracketsPerVerse = showBrackets && !wrapRangeWithBrackets;

  const formatReference = () => {
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
  };

  const renderArabicVerseContent = (verse: VerseData) => {
    if (Array.isArray(verse.words) && verse.words.length > 0) {
      return verse.words.map((word, idx) => {
        const isEndMarker = word.charTypeName === "end";

        if (isEndMarker && !showVerseNumbers) {
          return null;
        }

        if (isEndMarker) {
          // IMPORTANT: Use Unicode font for end markers; QCF fonts render the number glyphs poorly.
          const marker = word.textQpcHafs || "۝";
          return (
            <React.Fragment key={word.id ?? `${verse.number}-${idx}`}>
              <span
                style={{
                  fontFamily: "UthmanicHafs, serif",
                  color: accentColor,
                }}
              >
                {marker}
              </span>{" "}
            </React.Fragment>
          );
        }

        const fontFamily = word.codeV2
          ? `"QPC Mushaf Page ${word.pageNumber}"`
          : undefined;

        const code = word.codeV2;
        const canUseInnerHtml = typeof code === "string" && !/[<>]/.test(code);

        return (
          <React.Fragment key={word.id ?? `${verse.number}-${idx}`}>
            {canUseInnerHtml ? (
              <span
                style={fontFamily ? { fontFamily } : undefined}
                dangerouslySetInnerHTML={{ __html: code! }}
              />
            ) : (
              <span style={fontFamily ? { fontFamily } : undefined}>
                {code || word.textQpcHafs || ""}
              </span>
            )}{" "}
          </React.Fragment>
        );
      });
    }

    // Fallback (no word-level data): render plain text and optionally append an end marker.
    return (
      <>
        <span
          style={{
            fontFamily: `"QPC Mushaf Page ${verse.pageNumber}"`,
          }}
        >
          {verse.arabicTextQpcV2 || verse.arabicText}
        </span>
        {showVerseNumbers && (
          <span
            style={{
              fontFamily: "UthmanicHafs, serif",
              color: accentColor,
              marginInlineStart: 8,
            }}
          >
            {" "}
            {"۝"}
            {verse.number.toLocaleString("ar-EG")}
          </span>
        )}
      </>
    );
  };

  if (isLoading) {
    return (
      <div className={cardClasses} style={cardStyle}>
        <div className="space-y-4 mb-6">
          <div className="skeleton h-10 w-full" />
          <div className="skeleton h-10 w-4/5 ml-auto" />
          <div className="skeleton h-10 w-3/4 ml-auto" />
        </div>

        {showTranslation && (
          <div className="space-y-2 pt-4 border-t border-current/20">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
          </div>
        )}

        {showReference && (
          <div className="mt-6 flex justify-end">
            <div className="skeleton h-8 w-32 rounded-full" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cardClasses} style={cardStyle}>
      <div className={continuousLines ? "flex flex-col" : "space-y-4"}>
        {continuousLines ? (
          <>
            <div className="arabic-text leading-loose" dir="rtl">
              {wrapRangeWithBrackets && (
                <span
                  className="inline text-2xl md:text-3xl"
                  style={{
                    color: accentColor,
                    fontFamily: "'Amiri Quran', UthmanicHafs, serif",
                  }}
                >
                  ﴿
                </span>
              )}
              {verses.map((verse) => (
                <React.Fragment key={`ar-${verse.number}`}>
                  {showBracketsPerVerse && (
                    <span
                      className="inline text-2xl md:text-3xl"
                      style={{
                        color: accentColor,
                        fontFamily: "'Amiri Quran', UthmanicHafs, serif",
                      }}
                    >
                      ﴿
                    </span>
                  )}
                  {renderArabicVerseContent(verse)}
                  {showBracketsPerVerse && (
                    <span
                      className="inline text-2xl md:text-3xl"
                      style={{
                        color: accentColor,
                        fontFamily: "'Amiri Quran', UthmanicHafs, serif",
                      }}
                    >
                      ﴾
                    </span>
                  )}
                  {!showBrackets && " "}
                </React.Fragment>
              ))}
              {wrapRangeWithBrackets && (
                <span
                  className="inline text-2xl md:text-3xl"
                  style={{
                    color: accentColor,
                    fontFamily: "'Amiri Quran', UthmanicHafs, serif",
                  }}
                >
                  ﴾
                </span>
              )}
            </div>

            {showTranslation && (
              <div
                className="translation-text mt-4 pt-4 border-t"
                style={{
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                }}
              >
                {verses.map((verse) => (
                  <React.Fragment key={`tr-${verse.number}`}>
                    {showVerseNumbers && (
                      <span className="opacity-50 text-sm mr-1">
                        ({verse.number})
                      </span>
                    )}
                    {verse.translationText}{" "}
                  </React.Fragment>
                ))}
              </div>
            )}
          </>
        ) : (
          verses.map((verse, index) => (
            <div key={verse.number}>
              <div className="arabic-text" dir="rtl">
                {showBrackets &&
                  (showBracketsPerVerse ||
                    (wrapRangeWithBrackets && index === 0)) && (
                    <span
                      className="inline text-2xl md:text-3xl"
                      style={{
                        color: accentColor,
                        fontFamily: "'Amiri Quran', UthmanicHafs, serif",
                      }}
                    >
                      ﴿
                    </span>
                  )}
                {renderArabicVerseContent(verse)}
                {showBrackets &&
                  (showBracketsPerVerse ||
                    (wrapRangeWithBrackets && index === verses.length - 1)) && (
                    <span
                      className="inline text-2xl md:text-3xl"
                      style={{
                        color: accentColor,
                        fontFamily: "'Amiri Quran', UthmanicHafs, serif",
                      }}
                    >
                      ﴾
                    </span>
                  )}
              </div>

              {showTranslation && verse.translationText && (
                <p
                  className={`translation-text ${
                    index < verses.length - 1 ? "mb-6 pb-4 border-b" : ""
                  }`}
                  style={{
                    borderColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                  }}
                >
                  {showVerseNumbers && (
                    <span className="opacity-50 text-sm mr-2">
                      ({verse.number})
                    </span>
                  )}
                  {verse.translationText}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {showReference && (
        <div className="mt-6 flex justify-end">
          <div className="surah-badge">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span>{formatReference()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function isColorDark(hexColor: string): boolean {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

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
    continuousLines = false,
  } = style;

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
  const isSingleVerse = fromAyah === toAyah;
  const isRange = verses.length > 1;
  const wrapRangeWithBrackets = showBrackets && isRange;
  const showBracketsPerVerse = showBrackets && !wrapRangeWithBrackets;

  const formatReference = () => {
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
  };

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
      📖 ${formatReference()}
    </span>
  </div>
  `
      : ""
  }
</div>`;
}
