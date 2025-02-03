/**
 * Interface for a stemmer.
 */
export interface IStemmer {
    /**
     * Stems a single word.
     * @param word The word to stem.
     * @returns The stemmed word.
     */
    stem(word: string): string;
  
    /**
     * Stems an array of words.
     * @param words An array of words.
     * @returns An array of stemmed words.
     */
    stemWords(words: string[]): string[];
  }