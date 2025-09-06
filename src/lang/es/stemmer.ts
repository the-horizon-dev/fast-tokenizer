import { BaseStemmer, StemmerDictionary } from "../../stemmer.js";

/**
 * SpanishStemmer applies a series of rules to reduce Spanish words to their stem.
 * 
 * The algorithm follows these steps:
 * 
 * 1. **Plural Reduction:**
 *    - If a word ends with "ces", it is converted to end with "z" (e.g. "luces" → "luz").
 *    - Otherwise, if a word ends with "es", the suffix is removed.
 *    - Otherwise, if a word ends with a trailing "s" (but not "ss") and is longer than 3 letters, the "s" is removed.
 * 
 * 2. **Verbal Endings Removal:**
 *    - Removes common gerund endings ("ando", "iendo") if the remaining stem is sufficiently long.
 *    - Removes common past participle endings ("ado", "ido").
 *    - Removes infinitive endings ("ar", "er", "ir") if the word is long enough.
 * 
 * 3. **Adverbial Ending Removal:**
 *    - Removes the adverbial suffix "mente" if present.
 * 
 * 4. **Trailing Vowel Removal:**
 *    - Optionally removes a trailing "e" (when the remainder contains a vowel).
 * 
 * 5. **Double Consonant Reduction:**
 *    - If the word ends with two identical consonants (except for "l", "s", or "z"), one is removed.
 */
export class Stemmer extends BaseStemmer {
  constructor(dictionary?: StemmerDictionary) {
    super(dictionary);
  }

  protected applyStemming(word: string): string {
    let result: string = word.toLowerCase();

    if (result.length < 3) {
      return result;
    }

    // --- Step 1: Plural Reduction ---
    if (result.endsWith("ces") && result.length > 3) {
      // e.g., "luces" → "luz"
      result = result.slice(0, -3) + "z";
    } else if (result.endsWith("es") && result.length > 3) {
      // e.g., "naciones" → "nacion"
      result = result.slice(0, -2);
    } else if (result.endsWith("s") && !result.endsWith("ss") && result.length > 3) {
      // e.g., "gatos" → "gato"
      result = result.slice(0, -1);
    }

    // --- Step 2: Remove common verbal endings ---
    // Remove gerund endings ("ando", "iendo").
    if ((result.endsWith("ando") || result.endsWith("iendo")) && result.length > 5) {
      result = result.slice(0, -4);
    }
    // Remove past participle endings ("ado", "ido").
    else if ((result.endsWith("ado") || result.endsWith("ido")) && result.length > 4) {
      result = result.slice(0, -3);
    }
    // Remove infinitive endings ("ar", "er", "ir").
    if ((result.endsWith("ar") || result.endsWith("er") || result.endsWith("ir")) && result.length > 3) {
      result = result.slice(0, -2);
    }

    // --- Step 3: Remove adverbial ending "mente" ---
    if (result.endsWith("mente") && result.length > 6) {
      result = result.slice(0, -5);
    }

    // --- Step 4: Remove trailing "e" if applicable ---
    if (result.endsWith("e") && result.length > 3) {
      const temp = result.slice(0, -1);
      if (/[aeiou]/.test(temp)) {
        result = temp;
      }
    }

    // --- Step 5: Handle double consonants at the end ---
    if (result.length > 2) {
      const lastChar = result[result.length - 1];
      const secondLastChar = result[result.length - 2];
      if (lastChar === secondLastChar && !["l", "s", "z"].includes(lastChar)) {
        result = result.slice(0, -1);
      }
    }

    return result;
  }
}
