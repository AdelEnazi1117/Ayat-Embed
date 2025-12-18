# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Commands

- **Dev**: `npm run dev`
- **Build**: `npm run build`
- **Start**: `npm run start`
- **Lint**: `npx eslint .` (Uses ESLint v9 flat config)
- **No Testing**: No test framework configured (Jest/Vitest not found)

## Project Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript with React 19 (Strict mode enabled)
- **Styling**: Tailwind CSS v4 (CSS-based configuration in `src/app/globals.css`)
- **UI**: React 19 with client components for embed functionality
- **Fonts**: Kitab font files in `public/fonts/` for Uthmani rendering

## Project Specifics (Non-Obvious)

### API & Data

- **Basmala Stripping**: AlQuran Cloud API includes Basmala in first verse of all surahs except Al-Fatiha. The `fetchAyah` function in [`src/lib/api.ts`](src/lib/api.ts:34) automatically strips it for Surahs 2-114.
- **API Limits**: Hard limit of 30 verses per request via [`MAX_VERSES_LIMIT`](src/lib/api.ts:5). Larger ranges silently fail.
- **Translation Fetch**: Separate API calls for Arabic text (`quran-uthmani` edition) and English translations (`en.sahih` edition).

### Embed System

- **Embed Protocol**: Embed iframes communicate height via `qveg:height` postMessage with `{id, height}` payload. See [`EmbedClient.tsx`](src/app/embed/[surah]/[ayah]/EmbedClient.tsx:68).
- **Height Calculation**: Embed fallback height = `32 + (verseCount × perVerseHeight) + referenceHeight`, capped at 700px. See [`generateIframeCode`](src/lib/constants.ts:237).
- **Dynamic Routes**: Embed pages use `src/app/embed/[surah]/[ayah]` pattern for iframe integration. Params and searchParams are handled as Promises (Next.js 15/16 requirement).

### Styling & Fonts

- **Tailwind v4 Configuration**: All theme configurations (colors, fonts, animations) are defined in [`src/app/globals.css`](src/app/globals.css) using the `@theme` block. `tailwind.config.js` does NOT exist.
- **Color URL Params**: Embed colors must be passed as hex **without** `#` prefix (`ff97316` not `#f97316`). See [`getEmbedUrl`](src/lib/constants.ts:203).
- **Font Requirement**: Arabic/Quranic text requires `kitab` font family (defined in CSS theme) for proper Uthmani script rendering.
- **Style Generation**: 70% chance of curated presets, 30% random generation. See [`generateRandomStyle`](src/lib/constants.ts:140).
- **Custom Theme**: Navy color palette (`--color-navy-50` to `--color-navy-950`) with accent colors.

### Language & Internationalization

- **RTL/LTR Support**: Language context in [`src/contexts/LanguageContext.tsx`](src/contexts/LanguageContext.tsx) manages `dir` and `lang` on `document.documentElement`.
- **Translation System**: UI strings in [`src/lib/translations.ts`](src/lib/translations.ts) but embedded verses fetch translations separately from API.

### State Management

- **Global State**: Language state via React Context for translations and direction.
- **Local State**: Verse selection and styling in main page state (not global) for performance.
- **No Redux/Zustand**: Uses only React built-in state management.

### Analytics & Tracking

- **Umami Analytics**: Comprehensive tracking system in [`src/lib/analytics.ts`](src/lib/analytics.ts)
- **Event Types**: CTA clicks, social interactions, page engagement, scroll depth
- **Tracking Functions**: `trackCTA()`, `trackSocial()`, `trackEvent()`, `usePageAnalytics()`
- **Scroll Tracking**: Automatic tracking at 25%, 50%, 75%, 90% scroll depths
- **Engagement Timer**: 10-second engagement tracking for user interaction analysis
- **Event Slugification**: Automatic slugification of event names for consistent reporting

### Critical Gotchas

- **Font Files**: Kitab font files must be in `public/fonts/` directory, not imported via CSS.
- **Embed Dependencies**: Embed components require both `embedId` prop and postMessage implementation.
- **API Coupling**: No caching layer - each request hits external AlQuran Cloud API directly.
- **TypeScript Strict**: All components must satisfy strict type checking with no implicit any.
- **ESLint v9**: Configuration is in [`eslint.config.mjs`](eslint.config.mjs).

## Architecture Overview

The application consists of:

1. **Main App** (`src/app/page.tsx`): User interface for creating and customizing verse embeds
2. **Embed System** (`src/app/embed/[surah]/[ayah]`): Iframe-ready pages with postMessage height sync
3. **QuranCard Component** (`src/components/QuranCard.tsx`): Shared component for rendering verses in both contexts
4. **API Layer** (`src/lib/api.ts`): AlQuran Cloud integration with Basmala handling
5. **Style Engine** (`src/lib/constants.ts`): Random generation and preset management for embed styling
6. **Language System** (`src/contexts/LanguageContext.tsx`): RTL/LTR switching and translations

## Component Architecture

### Core Components

- **QuranCard**: Shared component for both main app and embed contexts. Uses `isArabicUI` prop to determine UI language differences.
- **EmbedClient**: Handles iframe embedding with postMessage height synchronization. Requires `embedId` prop.
- **LanguageToggle**: Simple component for switching between Arabic and English UI languages.
- **Footer**: Static footer component with branding and links.

### Client Component Pattern

- All interactive components use `'use client'` directive for React hooks compatibility
- Embed components specifically need client-side rendering for postMessage functionality
- Main app can use server components where possible for performance

### Context Providers

- **LanguageProvider**: Must wrap entire app in `src/app/providers.tsx`
- Manages language state with localStorage persistence
- Sets `document.documentElement` attributes for RTL/LTR

## Performance Considerations

### API Optimization

- **No Caching**: Currently no built-in caching - each request hits AlQuran Cloud API directly
- **Batch Requests**: `fetchVersesRange` makes parallel requests for multiple verses (max 30)
- **Font Loading**: Kitab fonts load from `public/fonts/` - ensure files exist before deployment

### Embed Optimization

- **Lazy Loading**: Iframe embeds use `loading="lazy"` by default
- **Height Calculation**: Provides fallback when postMessage fails
- **Minimal Dependencies**: Embed pages only load necessary components

### Bundle Size

- **Next.js Standalone**: Configured for containerized deployments
- **TypeScript Strict**: NoEmit enabled - no TypeScript compilation in build
- **Tailwind 4 Engine**: Uses the new lightning-fast CSS-based engine.

## Error Handling Patterns

### API Error Handling

- All API calls wrapped in try/catch blocks
- Errors logged with `console.error` and re-thrown
- No silent failures - all errors propagate to UI
- Specific error messages for different failure types

### UI Error States

- **Loading States**: All async operations show loading indicators
- **Error Boundaries**: React error boundaries for component failures
- **Graceful Degradation**: Embed falls back to calculated height if postMessage fails
- **Language Fallbacks**: English UI serves as fallback when Arabic unavailable

### Validation Patterns

- **Surah Validation**: Checks verse numbers against `surah.numberOfAyahs`
- **Range Validation**: Ensures verse ranges don't exceed API limits
- **Parameter Validation**: URL parameters validated before processing

## Deployment & Configuration

### Build Configuration

- **Next.js Config**: Standalone output mode in `next.config.js`
- **React Strict Mode**: Enabled for development error detection
- **TypeScript**: Strict mode with no implicit any
- **Path Aliases**: `@/*` maps to `./src/*` for clean imports

### Environment Requirements

- **Optional Environment Variables**:
  - `NEXT_PUBLIC_UMAMI_URL` - Umami analytics script URL
  - `NEXT_PUBLIC_UMAMI_ID` - Umami website ID
  - `NEXT_PUBLIC_SITE_URL` - Site URL for metadata (defaults to ayatembed.adelenazi.cloud)
- **Font Files**: Kitab fonts must be in `public/fonts/` directory
- **Node.js**: Compatible with Node.js 20+ (Next.js 16 recommended)

### Docker Support

- **Dockerfile**: Multi-stage build with standalone output
- **.dockerignore**: Excludes unnecessary files from build context

## Development Guidelines

### File Organization

```
src/
├── app/           # Next.js App Router pages
├── components/    # React components
├── contexts/      # React Context providers
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and configurations
├── types/         # TypeScript type definitions
└── utils/         # Helper utilities
```

### Code Style Conventions

- **Components**: Functional components with TypeScript interfaces
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Imports**: Use `@/` path aliases from `tsconfig.json`
- **Styling**: Tailwind CSS v4 classes with CSS-based theme
- **Hooks**: Custom hooks start with 'use' prefix

### Component Patterns

- **Props Interface**: Always define TypeScript interfaces for component props
- **Default Props**: Use default parameter values or default exports
- **Conditional Rendering**: Use early returns for error/loading states
- **Event Handlers**: Use arrow functions or bind in constructor

## API Integration Patterns

### AlQuran Cloud API

- **Base URL**: `https://api.alquran.cloud/v1` (hardcoded)
- **Editions**: Arabic uses `quran-uthmani`, English uses `en.sahih`
- **Rate Limiting**: No rate limiting implemented - consider for production
- **Error Responses**: All responses include `code` field (200 = success)

### Data Flow

1. **Surah List**: Fetch once, cache in component state
2. **Verse Fetching**: Individual API calls for each verse with translations
3. **Range Fetching**: Parallel requests for multiple verses
4. **Error Handling**: Retry logic not implemented - consider for robustness

### Type Safety

- **Response Types**: All API responses use strict TypeScript interfaces
- **Error Types**: Custom error types for different failure scenarios
- **Validation**: Runtime validation of API response structure

## Testing Guidelines

### Current State

- **No Test Framework**: Jest, Vitest, or other testing frameworks not configured
- **Manual Testing**: All testing done through browser dev tools
- **Future Consideration**: Would benefit from unit tests for API functions

### Manual Testing Patterns

- **API Testing**: Test in browser dev tools network tab
- **Embed Testing**: Use iframe inspector to verify postMessage communication
- **Responsive Testing**: Test on different screen sizes for embed compatibility
- **Language Testing**: Verify RTL/LTR switching works correctly

### Recommended Testing Tools

- **Playwright**: For end-to-end embed testing
- **Jest + React Testing Library**: For component unit tests
- **Storybook**: For component development and documentation

## Common Utilities & Patterns

### Styling Utilities

- **Custom Colors**: CSS Variables (e.g., `var(--color-navy-800)`)
- **Font Classes**: `font-kitab` for Arabic, `font-sans` for UI text
- **Responsive Classes**: Mobile-first responsive design

### Language Utilities

- **Translation Hook**: `useLanguage()` from LanguageContext
- **Direction Detection**: `isRTL` boolean from context
- **Storage**: Language preference saved to localStorage

### Embed Utilities

- **URL Generation**: `getEmbedUrl()` in constants handles all parameter encoding
- **Iframe Code**: `generateIframeCode()` creates complete embed snippets
- **Height Sync**: Automatic postMessage height synchronization

## Security Considerations

### API Security

- **No Authentication**: AlQuran Cloud API is public
- **CORS**: Next.js handles CORS automatically for server-side requests
- **XSS Prevention**: All user inputs sanitized before display

### Embed Security

- **iframe Sandbox**: No sandbox attributes - may need for production
- **postMessage Validation**: Check message source and structure
- **URL Parameters**: Validate all embed parameters before use
