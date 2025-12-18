import { Metadata } from "next";
import Script from "next/script";
import EmbedClient from "./EmbedClient";

interface EmbedPageProps {
  params: Promise<{
    surah: string;
    ayah: string;
  }>;
  searchParams: Promise<{
    color?: string;
    bg?: string;
    text?: string;
    theme?: string;
    translation?: string;
    reference?: string;
    verseNumbers?: string;
    accentLine?: string;
    transparentBg?: string;
    brackets?: string;
    continuousLines?: string;
    lang?: string;
    embedId?: string;
  }>;
}

export async function generateMetadata({
  params,
}: EmbedPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Quran - Surah ${resolvedParams.surah}:${resolvedParams.ayah}`,
    description: `Embedded Quranic verse from Surah ${resolvedParams.surah}, Ayah ${resolvedParams.ayah}`,
    robots: "noindex, nofollow",
  };
}

export default async function EmbedPage({
  params,
  searchParams,
}: EmbedPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const embedId = resolvedSearchParams.embedId;

  const surahNumber = parseInt(resolvedParams.surah, 10);

  let fromAyah = 1;
  let toAyah = 1;

  if (resolvedParams.ayah.includes("-")) {
    const parts = resolvedParams.ayah.split("-");
    fromAyah = parseInt(parts[0], 10);
    toAyah = parseInt(parts[1], 10);
  } else {
    fromAyah = parseInt(resolvedParams.ayah, 10);
    toAyah = fromAyah;
  }

  if (
    isNaN(surahNumber) ||
    isNaN(fromAyah) ||
    isNaN(toAyah) ||
    surahNumber < 1 ||
    surahNumber > 114 ||
    fromAyah < 1 ||
    toAyah < fromAyah
  ) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "transparent" }}
      >
        <div className="text-center bg-navy-800 p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-2 text-white">Invalid Verse</h1>
          <p className="text-navy-400">
            Please check the Surah and Ayah numbers.
          </p>
        </div>
      </div>
    );
  }

  const accentColor = resolvedSearchParams.color
    ? `#${resolvedSearchParams.color}`
    : "#f97316";
  const backgroundColor = resolvedSearchParams.bg
    ? `#${resolvedSearchParams.bg}`
    : "#1c2331";
  const textColor = resolvedSearchParams.text
    ? `#${resolvedSearchParams.text}`
    : "#ffffff";
  const theme = (resolvedSearchParams.theme === "light" ? "light" : "dark") as
    | "dark"
    | "light";
  const showTranslation = resolvedSearchParams.translation !== "false";
  const showReference = resolvedSearchParams.reference !== "false";
  const showVerseNumbers = resolvedSearchParams.verseNumbers !== "false";
  const showAccentLine = resolvedSearchParams.accentLine !== "false";
  const transparentBackground = resolvedSearchParams.transparentBg === "true";
  const showBrackets = resolvedSearchParams.brackets !== "false";
  const continuousLines = resolvedSearchParams.continuousLines === "true";
  const isArabicUI = resolvedSearchParams.lang === "ar";

  return (
    <>
      <EmbedClient
        surahNumber={surahNumber}
        fromAyah={fromAyah}
        toAyah={toAyah}
        accentColor={accentColor}
        backgroundColor={backgroundColor}
        textColor={textColor}
        theme={theme}
        showTranslation={showTranslation}
        showReference={showReference}
        showVerseNumbers={showVerseNumbers}
        showAccentLine={showAccentLine}
        transparentBackground={transparentBackground}
        showBrackets={showBrackets}
        continuousLines={continuousLines}
        isArabicUI={isArabicUI}
        embedId={embedId}
      />
      <Script id="embed-style-override" strategy="afterInteractive">
        {`
          // Override root layout styles for embed pages only after hydration
          if (window.location.pathname.includes('/embed/')) {
            document.body.classList.add('embed-page');

            // Apply styles without causing hydration mismatch
            Object.assign(document.body.style, {
              background: 'transparent',
              margin: '0',
              padding: '0',
              minHeight: 'auto'
            });
          }
        `}
      </Script>
    </>
  );
}
