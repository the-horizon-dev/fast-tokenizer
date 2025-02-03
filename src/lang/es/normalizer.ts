/**
 * Provides normalization for Spanish text.
 */
export class Normalizer {
    public static normalize(text: string): string {
      return text.trim().replace(/\s+/g, " ");
    }
  }
  