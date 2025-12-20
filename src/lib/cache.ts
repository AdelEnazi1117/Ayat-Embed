/**
 * Client-side caching for Quran data
 * 
 * Provides in-memory caching to prevent redundant API calls within the same
 * browser session. Quran data is immutable, so long cache TTLs are safe.
 */

import type { Surah, VerseData } from "@/types";

// Cache configuration
const SURAHS_CACHE_TTL = 30 * 60 * 1000; // 30 minutes
const VERSE_CACHE_TTL = 10 * 60 * 1000;  // 10 minutes
const MAX_VERSE_CACHE_SIZE = 200;        // Max cached verses to prevent memory bloat

// Surahs cache (list of 114 surahs - rarely changes)
let surahsCache: { data: Surah[]; timestamp: number } | null = null;

// Verse cache with LRU-style eviction
const verseCache = new Map<string, { data: VerseData; timestamp: number }>();

/**
 * Get cached surahs list if still valid
 */
export function getCachedSurahs(): Surah[] | null {
  if (!surahsCache) return null;
  
  const isExpired = Date.now() - surahsCache.timestamp > SURAHS_CACHE_TTL;
  if (isExpired) {
    surahsCache = null;
    return null;
  }
  
  return surahsCache.data;
}

/**
 * Store surahs list in cache
 */
export function setCachedSurahs(surahs: Surah[]): void {
  surahsCache = {
    data: surahs,
    timestamp: Date.now(),
  };
}

/**
 * Generate cache key for a verse
 */
function getVerseKey(surahNumber: number, ayahNumber: number): string {
  return `${surahNumber}:${ayahNumber}`;
}

/**
 * Get cached verse data if still valid
 */
export function getCachedVerse(surahNumber: number, ayahNumber: number): VerseData | null {
  const key = getVerseKey(surahNumber, ayahNumber);
  const cached = verseCache.get(key);
  
  if (!cached) return null;
  
  const isExpired = Date.now() - cached.timestamp > VERSE_CACHE_TTL;
  if (isExpired) {
    verseCache.delete(key);
    return null;
  }
  
  // Move to end (most recently used) by re-inserting
  verseCache.delete(key);
  verseCache.set(key, cached);
  
  return cached.data;
}

/**
 * Store verse data in cache with LRU eviction
 */
export function setCachedVerse(surahNumber: number, ayahNumber: number, data: VerseData): void {
  const key = getVerseKey(surahNumber, ayahNumber);
  
  // Evict oldest entries if cache is full
  if (verseCache.size >= MAX_VERSE_CACHE_SIZE) {
    const oldestKey = verseCache.keys().next().value;
    if (oldestKey) {
      verseCache.delete(oldestKey);
    }
  }
  
  verseCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * Get multiple cached verses at once
 */
export function getCachedVerses(
  surahNumber: number,
  fromAyah: number,
  toAyah: number
): { verses: (VerseData | null)[]; allCached: boolean } {
  const verses: (VerseData | null)[] = [];
  let allCached = true;
  
  for (let ayah = fromAyah; ayah <= toAyah; ayah++) {
    const cached = getCachedVerse(surahNumber, ayah);
    verses.push(cached);
    if (!cached) {
      allCached = false;
    }
  }
  
  return { verses, allCached };
}

/**
 * Clear all caches (useful for development/testing)
 */
export function clearAllCaches(): void {
  surahsCache = null;
  verseCache.clear();
}
