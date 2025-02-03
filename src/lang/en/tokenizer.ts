import { TokenizerOptions } from "../../interfaces/ITokenizer";
import { Tokenizer as CoreTokenizer } from "../../tokenizer";
import { Stopwords } from "./stopwords/stopwords";

/**
 * English-specific tokenizer implementation.
 * Extends the core tokenizer with English language support.
 * 
 * @example
 * ```typescript
 * const tokens = Tokenizer.tokenize("Hello world!", { removeStopWords: true });
 * console.log(tokens); // ["hello", "world"]
 * ```
 */
export class Tokenizer extends CoreTokenizer {
  /**
   * Static convenience method for tokenizing English text.
   * Creates a new tokenizer instance for each call.
   *
   * @param text - The English text to tokenize
   * @param options - Optional tokenization configuration
   * @returns Array of processed tokens
   */
  public static tokenize(text: string, options?: TokenizerOptions): string[] {
    return new Tokenizer().tokenize(text, options);
  }

  /**
   * Provides the set of English stop words for filtering.
   * Overrides the base class implementation.
   *
   * @param options - Optional tokenizer configuration
   * @returns A readonly set of English stop words
   */
  protected getStopWords(options?: TokenizerOptions): ReadonlySet<string> {
    if (options?.languageStopWordsSet) {
      return options.languageStopWordsSet;
    }
    return Stopwords.getStopWords();
  }
}
