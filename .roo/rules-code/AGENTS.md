# Code Mode Rules (Non-Obvious Only)

- **Basmala Logic**: When adding new API methods, ensure `stripBasmala` logic handles Surah 2-114 differently than Al-Fatiha (Surah 1). See [`src/lib/api.ts`](src/lib/api.ts:34).
- **Embed Height Messaging**: Any embeddable component MUST implement `qveg:height` postMessage protocol with `{id, height}` payload for container synchronization.
- **Color Parameter Stripping**: Always strip `#` from hex colors in URL parameters using `.replace("#", "")` to match API expectations.
- **Kitab Font Usage**: Arabic/Quranic text MUST use `kitab` font-family class (not just CSS font-family) for proper Uthmani script rendering.
- **Translation Toggle**: Random style generation has 90% chance to show translations, 85% chance to show references. See [`generateRandomStyle`](src/lib/constants.ts:165).
- **Analytics Integration**: All user interactions should call analytics functions from [`src/lib/analytics.ts`](src/lib/analytics.ts) - use `trackCTA()` for button clicks, `trackSocial()` for external links.
