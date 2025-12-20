const QPC_V2_CDN_BASE =
  "https://verses.quran.foundation/fonts/quran/hafs/v2/woff2";

const STYLE_TAG_ID = "qveg-quran-page-fonts";

const loadedPages = new Set<number>();

function getStyleTag(): HTMLStyleElement {
  let el = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = STYLE_TAG_ID;
    document.head.appendChild(el);
  }
  return el;
}

function buildPageFontFace(page: number): string {
  // CDN only - as recommended by Quran Foundation docs
  // "We strongly recommend against downloading and storing font files locally"
  return `@font-face {
  font-family: "QPC Mushaf Page ${page}";
  src: url("${QPC_V2_CDN_BASE}/p${page}.woff2") format("woff2");
  font-display: swap;
}`;
}

export function ensureQpcV2FontsLoaded(pages: number[]) {
  if (typeof document === "undefined") return;

  const normalized = pages
    .filter((p) => Number.isFinite(p) && p >= 1 && p <= 604)
    .map((p) => Math.floor(p));

  const toAdd: number[] = [];
  for (const p of normalized) {
    if (!loadedPages.has(p)) {
      loadedPages.add(p);
      toAdd.push(p);
    }
  }

  if (toAdd.length === 0) return;

  const css = toAdd.map(buildPageFontFace).join("\n");
  const styleTag = getStyleTag();
  styleTag.appendChild(document.createTextNode(`${css}\n`));
}


