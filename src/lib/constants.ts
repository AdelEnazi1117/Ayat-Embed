import type { ColorPreset, CardStyle } from "@/types";

export const COLOR_PRESETS: ColorPreset[] = [
  { name: "Orange", value: "#f97316" },
  { name: "Gold", value: "#f59e0b" },
  { name: "Emerald", value: "#10b981" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#8b5cf6" },
];

export const BACKGROUND_PRESETS: ColorPreset[] = [
  { name: "Navy", value: "#1c2331" },
  { name: "Black", value: "#0a0a0a" },
  { name: "Dark Gray", value: "#1f2937" },
  { name: "White", value: "#ffffff" },
  { name: "Cream", value: "#fef3c7" },
];

export const TEXT_COLOR_PRESETS: ColorPreset[] = [
  { name: "White", value: "#ffffff" },
  { name: "Light Gray", value: "#e5e7eb" },
  { name: "Black", value: "#000000" },
  { name: "Gold", value: "#fbbf24" },
  { name: "Orange", value: "#f97316" },
];

export const DEFAULT_STYLE: CardStyle = {
  accentColor: "#f97316",
  backgroundColor: "#1c2331",
  textColor: "#ffffff",
  theme: "dark",
  showTranslation: true,
  showReference: true,
  showVerseNumbers: false,
  showAccentLine: true,
  transparentBackground: false,
  showBrackets: true,
};

export const DEFAULT_SURAH = 1;
export const DEFAULT_FROM_AYAH = 1;
export const DEFAULT_TO_AYAH = 1;

export const APP_NAME = "Ayat Embed";
export const APP_DESCRIPTION =
  "Ayat Embed lets you generate beautiful, embeddable Quranic verses for your website";

export const getEmbedUrl = (
  baseUrl: string,
  surah: number,
  fromAyah: number,
  toAyah: number,
  style: CardStyle,
  lang: "ar" | "en" = "en"
): string => {
  const params = new URLSearchParams({
    color: style.accentColor.replace("#", ""),
    bg: style.backgroundColor.replace("#", ""),
    text: style.textColor.replace("#", ""),
    theme: style.theme,
    translation: style.showTranslation.toString(),
    reference: style.showReference.toString(),
    verseNumbers: style.showVerseNumbers.toString(),
    accentLine: style.showAccentLine.toString(),
    transparentBg: style.transparentBackground.toString(),
    brackets: style.showBrackets.toString(),
    lang: lang,
  });

  if (fromAyah === toAyah) {
    return `${baseUrl}/embed/${surah}/${fromAyah}?${params.toString()}`;
  }

  return `${baseUrl}/embed/${surah}/${fromAyah}-${toAyah}?${params.toString()}`;
};

export const generateIframeCode = (
  baseUrl: string,
  surah: number,
  fromAyah: number,
  toAyah: number,
  style: CardStyle,
  lang: "ar" | "en" = "en"
): string => {
  const embedId = `qveg-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
  const embedUrl = getEmbedUrl(baseUrl, surah, fromAyah, toAyah, style, lang);
  const embedUrlWithId = `${embedUrl}&embedId=${embedId}`;
  const verseCount = toAyah - fromAyah + 1;
  const basePadding = 32; // approximate card padding + heading space
  const perVerseHeight = style.showTranslation ? 140 : 110;
  const referenceHeight = style.showReference ? 56 : 0;
  const fallbackHeight = Math.min(
    basePadding + verseCount * perVerseHeight + referenceHeight,
    700
  );

  const verseLabel =
    fromAyah === toAyah
      ? `${surah}:${fromAyah}`
      : `${surah}:${fromAyah}-${toAyah}`;

  return `<iframe 
  id="${embedId}"
  src="${embedUrlWithId}"
  width="100%"
  height="${fallbackHeight}"
  frameborder="0"
  style="max-width: 700px; border: none; background: transparent; display: block; margin: 0 auto; vertical-align: top; overflow: hidden;"
  title="Ayat Embed - Surah ${verseLabel}"
  loading="lazy"
></iframe>
<script>
(function() {
  const iframe = document.getElementById("${embedId}");
  if (!iframe) return;
  const updateHeight = (event) => {
    if (!event || !event.data || event.data.type !== "qveg:height" || event.data.id !== "${embedId}") return;
    const newHeight = Math.max(1, Math.round(event.data.height));
    iframe.style.height = newHeight + "px";
  };
  window.addEventListener("message", updateHeight, false);
})();
</script>`;
};
