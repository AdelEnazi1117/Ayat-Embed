"use client";

import { useEffect, useState } from "react";
import QuranCard from "@/components/QuranCard";
import { fetchSurahs, fetchVersesRange } from "@/lib/api";
import type { CardStyle, Surah, VerseData } from "@/types";

interface EmbedClientProps {
  surahNumber: number;
  fromAyah: number;
  toAyah: number;
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
  isArabicUI: boolean;
  embedId?: string;
}

export default function EmbedClient({
  surahNumber,
  fromAyah,
  toAyah,
  accentColor,
  backgroundColor,
  textColor,
  theme,
  showTranslation,
  showReference,
  showVerseNumbers,
  showAccentLine,
  transparentBackground,
  showBrackets,
  continuousLines,
  isArabicUI,
  embedId,
}: EmbedClientProps) {
  const [verses, setVerses] = useState<VerseData[]>([]);
  const [surahName, setSurahName] = useState("");
  const [surahNameArabic, setSurahNameArabic] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refEl, setRefEl] = useState<HTMLDivElement | null>(null);

  const style: CardStyle = {
    accentColor,
    backgroundColor,
    textColor,
    theme,
    showTranslation,
    showReference,
    showVerseNumbers,
    showAccentLine,
    transparentBackground,
    showBrackets,
    continuousLines,
  };

  // Notify parent iframe about the required height
  useEffect(() => {
    const postHeight = () => {
      if (!embedId || !refEl) return;

      // Use getBoundingClientRect for more accurate height calculation
      const rect = refEl.getBoundingClientRect();
      const height = Math.ceil(rect.height);

      // Also check scrollHeight as fallback
      const scrollHeight = refEl.scrollHeight;
      const finalHeight = Math.max(height, scrollHeight);

      window.parent?.postMessage(
        { type: "qveg:height", id: embedId, height: finalHeight },
        "*"
      );
    };

    // Post height immediately and with delays to ensure accurate calculation
    postHeight();

    const timers = [
      setTimeout(postHeight, 100),
      setTimeout(postHeight, 300),
      setTimeout(postHeight, 1000), // Final check after full render
    ];

    if (embedId) {
      window.addEventListener("resize", postHeight);
    }

    return () => {
      timers.forEach(clearTimeout);
      if (embedId) {
        window.removeEventListener("resize", postHeight);
      }
    };
  }, [
    embedId,
    refEl,
    verses,
    isLoading,
    style.showTranslation,
    style.showReference,
    style.showVerseNumbers,
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const surahs = await fetchSurahs();
        const surah = surahs.find((s: Surah) => s.number === surahNumber);

        if (!surah) {
          setError("Surah not found");
          setIsLoading(false);
          return;
        }

        setSurahName(surah.englishName);
        setSurahNameArabic(surah.name);

        if (fromAyah > surah.numberOfAyahs || toAyah > surah.numberOfAyahs) {
          setError(
            `Ayah ${Math.max(fromAyah, toAyah)} does not exist in ${
              surah.englishName
            }`
          );
          setIsLoading(false);
          return;
        }

        const versesData = await fetchVersesRange(
          surahNumber,
          fromAyah,
          toAyah
        );
        setVerses(versesData);
      } catch (err) {
        console.error("Failed to load verses:", err);
        setError("Failed to load verses");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [surahNumber, fromAyah, toAyah]);

  if (error) {
    return (
      <div
        className="w-full p-4 text-center"
        style={{ background: "transparent" }}
        ref={setRefEl}
      >
        <div className="bg-navy-800 p-6 rounded-lg">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full p-4"
      style={{
        background: "transparent",
        minHeight: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
        width: "100%",
        maxWidth: "100%"
      }}
      ref={setRefEl}
    >
      <QuranCard
        verses={verses}
        surahName={surahName}
        surahNameArabic={surahNameArabic}
        surahNumber={surahNumber}
        style={style}
        isLoading={isLoading}
        isArabicUI={isArabicUI}
      />
    </div>
  );
}
