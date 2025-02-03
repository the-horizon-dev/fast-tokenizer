import { IStemmer } from "./interfaces/IStemmer";

/**
 * A dictionary for exceptions. A stemmer may use it to provide before/after
 * mappings for words that are not handled by the normal stemming rules.
 */
export interface StemmerDictionary {
  before: Record<string, string>;
  after: Record<string, string>;
}

/**
 * BaseStemmer provides caching and a framework for applying stemming logic.
 * Derived classes should override the abstract applyStemming() method with language‑specific logic.
 */
export abstract class BaseStemmer implements IStemmer {
  protected cache: Map<string, string>;
  protected dictionary: StemmerDictionary;

  constructor(dictionary?: StemmerDictionary) {
    this.cache = new Map<string, string>();
    // Use an empty dictionary if none is provided.
    this.dictionary = dictionary ?? { before: {}, after: {} };
  }

  /**
   * Stems a single word. First checks the cache and then looks for exceptions
   * in the "before" dictionary. If none is found, it calls the language‑specific
   * applyStemming() method. Finally, it checks the "after" dictionary.
   *
   * @param word - The word to stem.
   * @returns The stemmed word.
   */
  public stem(word: string): string {
    if (this.cache.has(word)) {
      const cachedWord = this.cache.get(word);
      if (cachedWord !== undefined) {
        return cachedWord;
      }
    }

    // Check for exception in the before-dictionary.
    if (word in this.dictionary.before) {
      const result = this.dictionary.before[word];
      this.cache.set(word, result);
      return result;
    }

    // Apply the language‑specific stemming algorithm.
    const stemmed = this.applyStemming(word);

    // Optionally adjust the result using the dictionary after-map.
    const finalStem = this.dictionary.after[stemmed] ?? stemmed;
    this.cache.set(word, finalStem);
    return finalStem;
  }

  /**
   * Stems an array of words.
   *
   * @param words - The words to stem.
   * @returns The stemmed words.
   */
  public stemWords(words: string[]): string[] {
    return words.map((word) => this.stem(word));
  }

  /**
   * Abstract method that applies language‑specific stemming.
   * Derived classes must implement this method.
   *
   * @param word - The word to stem.
   * @returns The stemmed word.
   */
  protected abstract applyStemming(word: string): string;
}
