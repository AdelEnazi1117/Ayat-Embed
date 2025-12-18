/**
 * HTML sanitization utilities for preventing XSS attacks
 */

/**
 * Escapes HTML special characters to prevent XSS injection
 * @param unsafe - Raw string that may contain HTML characters
 * @returns HTML-escaped string safe for insertion into HTML content
 */
export function escapeHtml(unsafe: string): string {
  if (typeof unsafe !== 'string') {
    return '';
  }

  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Validates and cleans API response text
 * @param text - Text from API response
 * @param maxLength - Maximum allowed length (default: 5000)
 * @returns Cleaned and validated text
 */
export function validateApiResponse(text: string, maxLength: number = 5000): string {
  if (typeof text !== 'string') {
    return '';
  }

  // Remove any potential HTML/script tags as additional defense
  const cleaned = text.replace(/<[^>]*>/g, '');

  // Limit length to prevent abuse
  if (cleaned.length > maxLength) {
    throw new Error(`Response too long: ${cleaned.length} > ${maxLength}`);
  }

  return cleaned;
}

/**
 * Escapes content for use in HTML attributes
 * @param unsafe - Raw string for attribute value
 * @returns Escaped string safe for HTML attributes
 */
export function escapeHtmlAttribute(unsafe: string): string {
  if (typeof unsafe !== 'string') {
    return '';
  }

  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validates a surah object structure and sanitizes string fields
 */
export function validateAndSanitizeSurah(surah: any): boolean {
  if (!surah || typeof surah !== 'object') {
    return false;
  }

  const requiredFields = ['number', 'name', 'englishName', 'englishNameTranslation', 'numberOfAyahs', 'revelationType'];

  // Check required fields exist
  for (const field of requiredFields) {
    if (!(field in surah)) {
      return false;
    }
  }

  // Validate field types and values
  if (typeof surah.number !== 'number' || surah.number < 1 || surah.number > 114) {
    return false;
  }

  if (typeof surah.numberOfAyahs !== 'number' || surah.numberOfAyahs < 1 || surah.numberOfAyahs > 286) {
    return false;
  }

  if (!['Meccan', 'Medinan'].includes(surah.revelationType)) {
    return false;
  }

  // Validate and sanitize string fields
  const stringFields = ['name', 'englishName', 'englishNameTranslation'];
  for (const field of stringFields) {
    if (typeof surah[field] !== 'string' || surah[field].length === 0 || surah[field].length > 200) {
      return false;
    }
    // Sanitize the string field
    surah[field] = escapeHtml(surah[field]);
  }

  return true;
}

/**
 * Validates an Ayah object structure
 */
export function validateAyahStructure(ayah: any): boolean {
  if (!ayah || typeof ayah !== 'object') {
    return false;
  }

  const requiredFields = ['number', 'text', 'numberInSurah', 'juz', 'manzil', 'page', 'ruku', 'hizbQuarter', 'sajda'];

  // Check required fields exist
  for (const field of requiredFields) {
    if (!(field in ayah)) {
      return false;
    }
  }

  // Validate numeric fields
  const numericFields = ['number', 'numberInSurah', 'juz', 'page', 'ruku', 'hizbQuarter'];
  for (const field of numericFields) {
    if (typeof ayah[field] !== 'number' || ayah[field] < 1) {
      return false;
    }
  }

  // Validate text field - increase max length for Arabic text
  if (typeof ayah.text !== 'string' || ayah.text.length === 0 || ayah.text.length > 2000) {
    return false;
  }

  // Validate manzil
  if (typeof ayah.manzil !== 'number' || ayah.manzil < 1 || ayah.manzil > 7) {
    return false;
  }

  // Validate sajda - can be boolean or object
  if (typeof ayah.sajda === 'boolean') {
    // Simple boolean is valid
    return true;
  } else if (typeof ayah.sajda === 'object' && ayah.sajda !== null) {
    // Object should have the expected structure
    const hasRequiredProps = 'recommended' in ayah.sajda && 'obligatory' in ayah.sajda;
    if (!hasRequiredProps) {
      return false;
    }
    // Validate boolean properties
    if (typeof ayah.sajda.recommended !== 'boolean' || typeof ayah.sajda.obligatory !== 'boolean') {
      return false;
    }
    // If there's an id field, it should be a number
    if ('id' in ayah.sajda && typeof ayah.sajda.id !== 'number') {
      return false;
    }
    return true;
  } else {
    return false;
  }
}