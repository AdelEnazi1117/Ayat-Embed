"use client";

import React, { useEffect, useMemo } from "react";
import type { CardStyle, VerseData } from "@/types";
import { ensureQpcV2FontsLoaded } from "@/lib/quranFonts";
import { isColorDark } from "@/lib/color-utils";
import { formatReference } from "@/lib/verse-formatter";
import Bracket from "./Bracket";

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
  } = style;
  const continuousLines = verses.length > 1;

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
              {wrapRangeWithBrackets && <Bracket type="open" color={accentColor} />}
              {verses.map((verse) => (
                <React.Fragment key={`ar-${verse.number}`}>
                  {showBracketsPerVerse && <Bracket type="open" color={accentColor} />}
                  {renderArabicVerseContent(verse)}
                  {showBracketsPerVerse && <Bracket type="close" color={accentColor} />}
                  {!showBrackets && " "}
                </React.Fragment>
              ))}
              {wrapRangeWithBrackets && <Bracket type="close" color={accentColor} />}
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
                    <Bracket type="open" color={accentColor} />
                  )}
                {renderArabicVerseContent(verse)}
                {showBrackets &&
                  (showBracketsPerVerse ||
                    (wrapRangeWithBrackets && index === verses.length - 1)) && (
                    <Bracket type="close" color={accentColor} />
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
            <span>{referenceText}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Re-export generateStaticHTML from html-generator module
export { generateStaticHTML } from "@/lib/html-generator";
