/**
 * Provides normalization for Brazilian Portuguese text.
 */
export class Normalizer {
    public static normalize(text: string): string {
      return text.trim().replace(/\s+/g, " ");
    }
  }
  