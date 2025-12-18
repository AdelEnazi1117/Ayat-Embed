# Architect Mode Rules (Non-Obvious Only)

- **Embed Architecture**: Dynamic route `src/app/embed/[surah]/[ayah]` designed for iframe embedding with `postMessage` height synchronization protocol.
- **Uthmani Font Strategy**: `Kitab` font family mandatory for proper Quranic text rendering - defines in Tailwind config, not runtime loading.
- **State Management Split**: Global language state via React Context, but verse selection and styling in main page state (not global) for performance.
- **API Dependency Pattern**: Heavily coupled to AlQuran Cloud API - no caching layer, each request hits external service.
- **Height Calculation Formula**: Embed fallback height uses `32 + (verseCount × perVerseHeight) + referenceHeight`, capped at 700px for consistent rendering.
