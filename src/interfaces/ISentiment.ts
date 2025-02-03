/**
 * The result of a sentiment analysis operation.
 */
export interface SentimentResult {
    /** The total sentiment score. */
    score: number;
    /** The score divided by the number of processed tokens. */
    comparative: number;
    /** The processed tokens (possibly after stemming). */
    tokens: string[];
    /** The tokens that contributed to the sentiment score. */
    words: string[];
    /** Tokens that contributed positively. */
    positive: string[];
    /** Tokens that contributed negatively. */
    negative: string[];
  }
  
  /**
   * Interface for a sentiment analysis module.
   */
  export interface ISentiment {
    /**
     * Analyzes the sentiment of the given text.
     *
     * @param text The text to analyze.
     * @param lang The language code (e.g. "en", "es", "pt"). Defaults to "en".
     * @returns A SentimentResult object.
     */
    analyze(text: string, lang?: string): SentimentResult;
  }