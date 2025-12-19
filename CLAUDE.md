# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Ayat Embed** is a Next.js 16 micro-SaaS application for generating embeddable Quranic verses. It's a bilingual (Arabic/English) tool that allows users to customize and export verses as either iFrame or static HTML for embedding in websites.

## Development Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build production version
- `npm start` - Start production server
- `npx eslint .` - Run ESLint for code quality checks (Uses ESLint v9 flat config)

## Architecture

### Core Components Structure

The application follows a clean separation of concerns:

**Main Builder Interface** (`src/app/page.tsx`)
- Single-page application with real-time preview
- Handles verse selection, style customization, and code generation
- Complex state management for verses, styling, and UI interactions
- Integrates analytics tracking for user interactions

**QuranCard Component** (`src/components/QuranCard.tsx`)
- Core component that renders Quranic verses with various styling options
- Supports both continuous lines and individual verse display modes
- Includes `generateStaticHTML()` function for HTML export functionality
- Handles Arabic RTL layout and bracket formatting (﴿...﴾)

**API Layer** (`src/lib/api.ts`)
- Wrapper around AlQuran Cloud API (https://api.alquran.cloud/v1)
- Fetches surahs, verses, and translations
- Handles Basmala stripping (except for Al-Fatiha)
- Limits verse ranges to 30 verses maximum (`MAX_VERSES_LIMIT`)

**Configuration & Constants** (`src/lib/constants.ts`)
- Defines color presets, default styles, and export utilities
- `generateIframeCode()` creates responsive iframe with auto-resizing script
- `generateRandomStyle()` for style randomization feature

**Analytics System** (`src/lib/analytics.ts`)
- Comprehensive tracking via Umami analytics
- Event tracking functions: `trackCTA()`, `trackSocial()`, `trackEvent()`
- `usePageAnalytics()` hook for page engagement and scroll tracking
- Automatic slugification of event names for consistent reporting

### Key Routes

- `/` - Main builder dashboard
- `/embed/[surah]/[ayah]` - Dynamic embed routes (supports ranges like `1-7`)
- `/how-to-use` - Usage documentation
- `/docs` - API documentation

### Styling System

**CardStyle Interface** (`src/types/index.ts`)
```typescript
{
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  theme: "dark" | "light";
  showTranslation: boolean;
  showReference: boolean;
  showVerseNumbers: boolean;
  showAccentLine: boolean;
  transparentBackground: boolean;
  showBrackets: boolean; // Shows ﴿...﴾ around verses
  continuousLines: boolean; // Concatenates verses vs individual display
}
```

### Internationalization

- Bilingual support via LanguageContext (`src/contexts/LanguageContext.tsx`)
- Arabic RTL layout handling throughout
- Translation strings in `src/lib/translations.ts`
- Dynamic direction switching based on language
- Language state persisted in localStorage

### Font Architecture

- **Kitab font** for Quranic Arabic text
- **IBM Plex Sans Arabic** for Arabic UI
- **Inter** for English UI
- Font loading configured in `src/app/layout.tsx`

## Important Implementation Details

### Verse Display Modes
The application supports two distinct verse rendering modes:

1. **Continuous Lines**: Verses flow together as one block with optional verse numbers
2. **Individual Verses**: Each verse displayed separately with borders between them

### iFrame Auto-Resize
The iframe export includes a sophisticated postMessage system for dynamic height adjustment based on content.

### Arabic Text Handling
- Proper RTL direction management
- Arabic numeral formatting for verse numbers
- Special bracket characters (﴿ ﴾) for verse boundaries
- Basmala handling for first verses

### Color System
Three-tier color presets:
- **Accent Colors**: Orange, Gold, Emerald, Blue, Purple
- **Background Colors**: Navy, Black, Dark Gray, White, Cream
- **Text Colors**: White, Light Gray, Black, Gold, Orange

## External Dependencies

- **AlQuran Cloud API**: Source for Quranic verses and translations
- **FontAwesome**: Icon system throughout the application
- **Lucide React**: Additional icon set
- **Next.js 16**: App Router with React 19
- **Tailwind CSS v4**: Styling system

### Security & Defaults
- **API Proxy**: Strictly whitelisted. Only authorized paths can go upstream.
- **Caching**: 1-hour cache on all Quran data proxy requests.
- **Default Style**: `showVerseNumbers` is now `true` by default.
- **Environment**: Requires `QF_CLIENT_ID` and `QF_CLIENT_SECRET`.

## Analytics & Tracking

The application includes comprehensive analytics via Umami:
- Analytics utilities in `src/lib/analytics.ts`
- Tracks CTA clicks, social interactions, page engagement
- Scroll depth tracking (25%, 50%, 75%, 90%)
- 10-second engagement timer
- Environment variables: `NEXT_PUBLIC_UMAMI_URL`, `NEXT_PUBLIC_UMAMI_ID`

## Deployment Notes

The application is container-ready with Docker support included. Optional environment variables:
- `NEXT_PUBLIC_UMAMI_URL` - Umami analytics script URL
- `NEXT_PUBLIC_UMAMI_ID` - Umami website ID
- `NEXT_PUBLIC_SITE_URL` - Site URL for metadata (defaults to ayatembed.adelenazi.cloud)