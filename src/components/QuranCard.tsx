"use client";

import React from "react";
import type { CardStyle, VerseData } from "@/types";

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
  } = style;

  const isDark = isColorDark(backgroundColor);

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
      <div className="space-y-4">
        {verses.map((verse, index) => (
          <div key={verse.number}>
            <div className="arabic-text" dir="rtl">
              <span
                className="inline text-2xl md:text-3xl"
                style={{ color: accentColor }}
              >
                ﴿
              </span>
              {verse.arabicText}
              <span
                className="inline text-2xl md:text-3xl"
                style={{ color: accentColor }}
              >
                {showVerseNumbers && verse.number.toLocaleString("ar-EG")}﴾
              </span>
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
        ))}
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

  const versesHtml = verses
    .map((verse, index) => {
      const ayahNumberArabic = verse.number.toLocaleString("ar-EG");
      const openBrace = `<span style="color: ${accentColor}; font-size: 1.5rem;">﴿</span>`;
      const closeBrace = showVerseNumbers
        ? `<span style="color: ${accentColor}; font-size: 1.5rem;">${ayahNumberArabic}﴾</span>`
        : `<span style="color: ${accentColor}; font-size: 1.5rem;">﴾</span>`;
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
      ${openBrace}${verse.arabicText}${closeBrace}
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
      ${verse.translationText}
    </p>
    `
        : ""
    }`;
    })
    .join("\n");

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
@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@400;500;600&display=swap');
</style>

<div style="
  font-family: 'Amiri', 'Traditional Arabic', 'Arabic Typesetting', serif;
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
