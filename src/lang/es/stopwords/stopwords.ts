import stopwords from './stopwords.json';

/**
 * Provides functionality related to Spanish stop words.
 */
export class Stopwords {
  // Define the Spanish stop words from JSON file
  private static readonly STOP_WORDS: ReadonlySet<string> = new Set(stopwords.words);

  /**
   * Retrieves the set of Spanish stop words.
   *
   * @returns A set of stop words.
   */
  public static getStopWords(): ReadonlySet<string> {
    return this.STOP_WORDS;
  }

  /**
   * Checks whether a word is a stop word.
   *
   * @param word - The word to check.
   * @returns True if the word is a stop word; otherwise, false.
   */
  public static isStopword(word: string): boolean {
    return this.STOP_WORDS.has(word);
  }
}
