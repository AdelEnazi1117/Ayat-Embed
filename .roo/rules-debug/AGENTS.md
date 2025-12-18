# Debug Mode Rules (Non-Obvious Only)

- **Basmala Double Display**: If double Basmala appears or first verse missing, check `stripBasmala` logic in [`src/lib/api.ts`](src/lib/api.ts:34) - it's called only for Surahs 2-114.
- **Iframe Height Sync**: Embed scrollbars or cut-off content indicates `embedId` not passed correctly or `qveg:height` postMessage failing. See [`EmbedClient.tsx`](src/app/embed/[surah]/[ayah]/EmbedClient.tsx:68).
- **RTL Document Direction**: Arabic UI layout breaks if `document.documentElement.dir` not set correctly by LanguageProvider. Check [`src/contexts/LanguageContext.tsx`](src/contexts/LanguageContext.tsx:32).
- **Verse Count Hard Limit**: API requests capped at 30 verses. Larger ranges silently fail at [`MAX_VERSES_LIMIT`](src/lib/api.ts:5).
- **Font Rendering Issues**: Uthmani script requires `kitab` font class - missing causes glyph corruption in Arabic text.
- **Analytics Not Loading**: If analytics events aren't firing, check `NEXT_PUBLIC_UMAMI_URL` and `NEXT_PUBLIC_UMAMI_ID` environment variables in [`src/app/layout.tsx`](src/app/layout.tsx:68).
