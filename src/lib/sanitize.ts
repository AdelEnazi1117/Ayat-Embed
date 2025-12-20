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

export function validateApiResponse(text: string, maxLength: number = 5000): string {
  if (typeof text !== 'string') {
    return '';
  }

  const cleaned = text.replace(/<[^>]*>/g, '');

  if (cleaned.length > maxLength) {
    throw new Error(`Response too long: ${cleaned.length} > ${maxLength}`);
  }

  return cleaned;
}

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

export function validateAndSanitizeSurah(surah: any): boolean {
  if (!surah || typeof surah !== 'object') {
    return false;
  }

  const requiredFields = ['number', 'name', 'englishName', 'englishNameTranslation', 'numberOfAyahs', 'revelationType'];

  for (const field of requiredFields) {
    if (!(field in surah)) {
      return false;
    }
  }

  if (typeof surah.number !== 'number' || surah.number < 1 || surah.number > 114) {
    return false;
  }

  if (typeof surah.numberOfAyahs !== 'number' || surah.numberOfAyahs < 1 || surah.numberOfAyahs > 286) {
    return false;
  }

  if (!['Meccan', 'Medinan'].includes(surah.revelationType)) {
    return false;
  }

  const stringFields = ['name', 'englishName', 'englishNameTranslation'];
  for (const field of stringFields) {
    // `englishNameTranslation` is optional-ish in upstream chapter payloads; allow empty string.
    const allowEmpty = field === 'englishNameTranslation';
    if (
      typeof surah[field] !== 'string' ||
      (!allowEmpty && surah[field].length === 0) ||
      surah[field].length > 200
    ) {
      return false;
    }
    // React handles escaping of string variables. We should not manually escape here 
    // as it creates visual artifacts (e.g. &#039; instead of ')
    // surah[field] = escapeHtml(surah[field]);
  }

  return true;
}

export function validateAyahStructure(ayah: any): boolean {
  if (!ayah || typeof ayah !== 'object') {
    return false;
  }

  const requiredFields = ['number', 'text', 'numberInSurah', 'juz', 'manzil', 'page', 'ruku', 'hizbQuarter', 'sajda'];

  for (const field of requiredFields) {
    if (!(field in ayah)) {
      return false;
    }
  }

  const numericFields = ['number', 'numberInSurah', 'juz', 'page', 'ruku', 'hizbQuarter'];
  for (const field of numericFields) {
    if (typeof ayah[field] !== 'number' || ayah[field] < 1) {
      return false;
    }
  }

  if (typeof ayah.text !== 'string' || ayah.text.length === 0 || ayah.text.length > 2000) {
    return false;
  }

  if (typeof ayah.manzil !== 'number' || ayah.manzil < 1 || ayah.manzil > 7) {
    return false;
  }

  if (typeof ayah.sajda === 'boolean') {
    return true;
  } else if (typeof ayah.sajda === 'object' && ayah.sajda !== null) {
    const hasRequiredProps = 'recommended' in ayah.sajda && 'obligatory' in ayah.sajda;
    if (!hasRequiredProps) {
      return false;
    }
    if (typeof ayah.sajda.recommended !== 'boolean' || typeof ayah.sajda.obligatory !== 'boolean') {
      return false;
    }
    if ('id' in ayah.sajda && typeof ayah.sajda.id !== 'number') {
      return false;
    }
    return true;
  } else {
    return false;
  }
}