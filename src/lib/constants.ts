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
  continuousLines: false,
};

const CURATED_STYLE_PRESETS: Omit<
  CardStyle,
  | "showTranslation"
  | "showReference"
  | "showVerseNumbers"
  | "showAccentLine"
  | "transparentBackground"
  | "showBrackets"
  | "continuousLines"
>[] = [
  {
    accentColor: "#f97316",
    backgroundColor: "#1c2331",
    textColor: "#ffffff",
    theme: "dark",
  },
  {
    accentColor: "#10b981",
    backgroundColor: "#0a0a0a",
    textColor: "#ffffff",
    theme: "dark",
  },
  {
    accentColor: "#3b82f6",
    backgroundColor: "#1f2937",
    textColor: "#ffffff",
    theme: "dark",
  },
  {
    accentColor: "#8b5cf6",
    backgroundColor: "#1c2331",
    textColor: "#e5e7eb",
    theme: "dark",
  },
  {
    accentColor: "#f59e0b",
    backgroundColor: "#0a0a0a",
    textColor: "#ffffff",
    theme: "dark",
  },
  {
    accentColor: "#f97316",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    theme: "light",
  },
  {
    accentColor: "#3b82f6",
    backgroundColor: "#fef3c7",
    textColor: "#000000",
    theme: "light",
  },
  {
    accentColor: "#10b981",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    theme: "light",
  },
  {
    accentColor: "#8b5cf6",
    backgroundColor: "#fef3c7",
    textColor: "#000000",
    theme: "light",
  },
];

const isLightColor = (color: string): boolean => {
  return color === "#ffffff" || color === "#fef3c7";
};

const getTextColorForBackground = (backgroundColor: string): string => {
  if (isLightColor(backgroundColor)) {
    const darkTextOptions = ["#000000", "#1f2937"];
    return darkTextOptions[Math.floor(Math.random() * darkTextOptions.length)];
  } else {
    const lightTextOptions = ["#ffffff", "#e5e7eb"];
    return lightTextOptions[
      Math.floor(Math.random() * lightTextOptions.length)
    ];
  }
};

const getAccentColorForScheme = (
  backgroundColor: string,
  textColor: string
): string => {
  if (!isLightColor(backgroundColor)) {
    const vibrantAccents = COLOR_PRESETS.filter(
      (c) => c.value !== textColor && c.value !== "#e5e7eb"
    );
    return vibrantAccents[Math.floor(Math.random() * vibrantAccents.length)]
      .value;
  } else {
    const lightSchemeAccents = COLOR_PRESETS;
    return lightSchemeAccents[
      Math.floor(Math.random() * lightSchemeAccents.length)
    ].value;
  }
};

export const generateRandomStyle = (): CardStyle => {
  const useCuratedPreset = Math.random() < 0.7;

  let accentColor: string;
  let backgroundColor: string;
  let textColor: string;
  let theme: "dark" | "light";

  if (useCuratedPreset) {
    const preset =
      CURATED_STYLE_PRESETS[
        Math.floor(Math.random() * CURATED_STYLE_PRESETS.length)
      ];
    accentColor = preset.accentColor;
    backgroundColor = preset.backgroundColor;
    textColor = preset.textColor;
    theme = preset.theme;
  } else {
    backgroundColor =
      BACKGROUND_PRESETS[Math.floor(Math.random() * BACKGROUND_PRESETS.length)]
        .value;
    textColor = getTextColorForBackground(backgroundColor);
    accentColor = getAccentColorForScheme(backgroundColor, textColor);
    theme = isLightColor(backgroundColor) ? "light" : "dark";
  }

  const randomShowTranslation = Math.random() > 0.1;
  const randomShowReference = Math.random() > 0.15;
  const randomShowVerseNumbers = Math.random() > 0.6;
  const randomShowAccentLine = Math.random() > 0.2;
  const randomTransparentBackground = Math.random() > 0.8;
  const randomShowBrackets = Math.random() > 0.15;
  const randomContinuousLines = Math.random() > 0.8;

  return {
    accentColor,
    backgroundColor,
    textColor,
    theme,
    showTranslation: randomShowTranslation,
    showReference: randomShowReference,
    showVerseNumbers: randomShowVerseNumbers,
    showAccentLine: randomShowAccentLine,
    transparentBackground: randomTransparentBackground,
    showBrackets: randomShowBrackets,
    continuousLines: randomContinuousLines,
  };
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
    continuousLines: style.continuousLines.toString(),
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
  const perVerseHeight = style.continuousLines
    ? style.showTranslation
      ? 100
      : 70
    : style.showTranslation
    ? 140
    : 110;
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
  scrolling="no"
  style="max-width: 700px; border: none; background: transparent; display: block; margin: 0 auto; vertical-align: top; overflow: hidden; resize: none;"
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

    // Force the iframe to recalculate its layout
    if (iframe.contentWindow) {
      iframe.contentWindow.document.body.style.overflow = 'hidden';
    }
  };

  // Listen for height updates
  window.addEventListener("message", updateHeight, false);

  // Prevent scrolling on the iframe itself
  iframe.style.overflow = 'hidden';
  iframe.setAttribute('scrolling', 'no');
})();
</script>`;
};
