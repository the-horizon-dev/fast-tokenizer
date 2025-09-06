import { BaseStemmer, StemmerDictionary } from "../../stemmer.js";

/**
 * EnglishStemmer provides a robust, multi‑step stemming algorithm for English.
 * It applies a series of rules to remove common suffixes and normalize words.
 *
 * The algorithm follows these steps:
 * 1. **Plural Reduction:**  
 *    - "sses" → "ss"  
 *    - "ies" → "y"  
 *    - A trailing "s" (if not "ss") is removed.
 *
 * 2. **Suffix Removal:**  
 *    - If the word ends with "ing" or "ed" and the remaining part contains a vowel,
 *      the suffix is removed.
 *
 * 3. **Trailing "e" Removal:**  
 *    - If the word ends with "e" and the remaining part has a vowel, the "e" is removed.
 *
 * 4. **Additional Suffix Transformations:**  
 *    - "ization" → "ize"  
 *    - "ational" → "ate"  
 *    - "fulness" → "ful"  
 *    - "ousness" → "ous"
 *
 * 5. **Double Consonant Reduction:**  
 *    - If the word ends with two identical consonants (except for l, s, or z), one is removed.
 */
export class Stemmer extends BaseStemmer {
  constructor(dictionary?: StemmerDictionary) {
    super(dictionary);
  }

  /**
   * Applies English‑specific stemming rules.
   *
   * @param word - The word to stem.
   * @returns The stemmed word.
   */
  protected applyStemming(word: string): string {
    // Work on a lowercase copy (assumes input is normalized).
    let result: string = word.toLowerCase();

    // If the word is too short, return as is.
    if (result.length < 3) {
      return result;
    }

    // --- Step 1: Plural Reduction ---
    if (result.endsWith("sses")) {
      // e.g., "dresses" → "dress"
      result = result.slice(0, -2);
    } else if (result.endsWith("ies")) {
      // e.g., "ponies" → "pony"
      result = result.slice(0, -3) + "y";
    } else if (result.endsWith("s") && !result.endsWith("ss")) {
      // e.g., "cats" → "cat"
      result = result.slice(0, -1);
    }

    // --- Step 2: Remove common suffixes "ing" and "ed" ---
    if (result.endsWith("ing") && result.length > 4) {
      const temp: string = result.slice(0, -3);
      // Only remove if the remaining stem contains a vowel.
      if (/[aeiou]/.test(temp)) {
        result = temp;
      }
    } else if (result.endsWith("ed") && result.length > 3) {
      const temp: string = result.slice(0, -2);
      if (/[aeiou]/.test(temp)) {
        result = temp;
      }
    }

    // --- Step 3: Remove a trailing "e" ---
    if (result.endsWith("e") && result.length > 3) {
      const temp: string = result.slice(0, -1);
      if (/[aeiou]/.test(temp)) {
        result = temp;
      }
    }

    // --- Step 4: Additional Suffix Transformations ---
    if (result.endsWith("ization") && result.length > 7) {
      // e.g., "modernization" → "modernize"
      result = result.slice(0, -7) + "ize";
    } else if (result.endsWith("ational") && result.length > 7) {
      // e.g., "rational" (from "rationalization") → "rate" or "ate"
      result = result.slice(0, -7) + "ate";
    } else if (result.endsWith("fulness") && result.length > 8) {
      // e.g., "gracefulness" → "graceful"
      result = result.slice(0, -4);  // Just remove 'ness'
    } else if (result.endsWith("ousness") && result.length > 7) {
      // e.g., "hazardousness" → "hazardous"
      result = result.slice(0, -4);  // Changed: only remove 'ness', keeping 'ous'
    }

    // --- Step 5: Remove double consonants at the end ---
    if (result.length > 2) {
      const lastChar: string = result[result.length - 1];
      const secondLastChar: string = result[result.length - 2];
      if (lastChar === secondLastChar && !["l", "s", "z"].includes(lastChar)) {
        result = result.slice(0, -1);
      }
    }

    return result;
  }
}
