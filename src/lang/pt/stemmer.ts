import { BaseStemmer, StemmerDictionary } from "../../stemmer.js";

/**
 * PortugueseStemmer implements a stemming algorithm for Brazilian Portuguese.
 * 
 * The algorithm applies these steps:
 * 
 * 1. **Plural Reduction:**
 *    - If a word ends with "ões" or "ães", convert it to end with "ão".
 *    - Else if a word ends with "es" and the remaining stem is sufficiently long, remove "es".
 *    - Else if a word ends with a single "s" (and not "ss"), remove the trailing "s".
 * 
 * 2. **Verbal and Infinitive Suffix Removal:**
 *    - Remove gerund endings ("ando", "endo", "indo") if the stem is long enough.
 *    - Remove past participle endings ("ado", "ido") if the stem is long enough.
 *    - Remove infinitive endings ("ar", "er", "ir") if applicable.
 * 
 * 3. **Adverbial Ending Removal:**
 *    - Remove the adverbial suffix "mente" (e.g., "rapidamente" → "rapida").
 * 
 * 4. **Trailing Vowel Removal:**
 *    - If the word ends with "e" and the remaining stem contains at least one vowel (including accented ones), remove the "e".
 * 
 * 5. **Double Consonant Reduction:**
 *    - If the word ends with two identical consonants (except "l", "s", or "z"), remove one.
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
    // Handle words ending in "ões" or "ães" → "ão"
    if ((result.endsWith("ões") || result.endsWith("ães")) && result.length > 3) {
      result = result.slice(0, -3) + "ão";
    }
    // For words ending in "es" (e.g., "casas" might be reduced to "cas")
    else if (result.endsWith("es") && result.length > 4) {
      result = result.slice(0, -2);
    }
    // Otherwise, if it ends in a trailing "s" (and not "ss") and is long enough
    else if (result.endsWith("s") && !result.endsWith("ss") && result.length > 3) {
      result = result.slice(0, -1);
    }

    // --- Step 2: Remove common verbal and infinitive endings ---
    // Remove gerund endings ("ando", "endo", "indo")
    if ((result.endsWith("ando") || result.endsWith("endo") || result.endsWith("indo")) && result.length > 5) {
      result = result.slice(0, -4);
    }
    // Remove past participle endings ("ado", "ido")
    else if ((result.endsWith("ado") || result.endsWith("ido")) && result.length > 4) {
      result = result.slice(0, -3);
    }
    // Remove infinitive endings ("ar", "er", "ir")
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
      // Consider vowels and accented vowels common in Portuguese.
      if (/[aeiouãõáéíóú]/.test(temp)) {
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
