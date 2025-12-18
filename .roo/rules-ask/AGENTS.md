# Ask Mode Rules (Non-Obvious Only)

- **Quran API Edition**: Uses `quran-uthmani` edition specifically for authentic Uthmani script rendering, not standard Arabic fonts.
- **Style Generation Algorithm**: 70% curated preset usage vs 30% random generation. Curated presets in [`src/lib/constants.ts`](src/lib/constants.ts:40) ensure consistent styling.
- **Component Dual Usage**: [`QuranCard.tsx`](src/components/QuranCard.tsx) renders both main app and embed content - check `isArabicUI` prop for UI language differences.
- **Translation Storage**: UI strings managed in [`src/lib/translations.ts`](src/lib/translations.ts) but embedded verses fetch translations separately from API.
