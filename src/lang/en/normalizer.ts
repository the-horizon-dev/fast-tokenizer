/**
 * Provides normalization for English text.
 */
export class Normalizer {
  /**
   * Normalizes English text by trimming and collapsing whitespace.
   *
   * @param text - The text to normalize.
   * @returns The normalized text.
   */
  public static normalize(text: string): string {
    return text.trim().replace(/\s+/g, " ");
  }
}
