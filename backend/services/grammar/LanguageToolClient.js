import axios from 'axios';

// Simple LRU / In-memory Cache for repeated text checks
const lruCache = new Map();
const MAX_CACHE_SIZE = 100;

export class LanguageToolClient {
  /**
   * Calls the LanguageTool public API with timeout, retry, and caching logic.
   * @param {string} text 
   * @returns {Promise<{ matches: Array, available: boolean }>}
   */
  static async checkGrammar(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return { matches: [], available: true };
    }

    const cacheKey = text.trim();
    if (lruCache.has(cacheKey)) {
      return lruCache.get(cacheKey);
    }

    const payload = new URLSearchParams();
    payload.append('text', cacheKey);
    payload.append('language', 'en-US');

    let attempts = 0;
    const maxAttempts = 2; // 1 initial + 1 retry

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const response = await axios.post('https://api.languagetool.org/v2/check', payload.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          timeout: 5000 // Configurable 5s timeout
        });

        if (response.data && Array.isArray(response.data.matches)) {
          const result = { matches: response.data.matches, available: true };

          // Cache management
          if (lruCache.size >= MAX_CACHE_SIZE) {
            const firstKey = lruCache.keys().next().value;
            lruCache.delete(firstKey);
          }
          lruCache.set(cacheKey, result);

          return result;
        }
      } catch (err) {
        console.warn(`[LanguageToolClient] Attempt ${attempts}/${maxAttempts} failed: ${err.message}`);
      }
    }

    // Return graceful fallback if LanguageTool API is unavailable
    console.error('[LanguageToolClient Error] LanguageTool API unreachable. Degrading gracefully.');
    return { matches: [], available: false };
  }
}

export default LanguageToolClient;
