import type { TokenizerOptions } from "../../interfaces/ITokenizer.js";
import { Tokenizer as CoreTokenizer } from "../../tokenizer.js";
import { Stopwords } from "./stopwords/stopwords.js";

/**
 * Spanish-specific tokenizer implementation.
 * Extends the core tokenizer with Spanish language support.
 */
export class Tokenizer extends CoreTokenizer {
  public static tokenize(text: string, options?: TokenizerOptions): string[] {
    return new this().tokenize(text, options);
  }

  protected getStopWords(options?: TokenizerOptions): ReadonlySet<string> {
    if (options?.languageStopWordsSet) {
      return options.languageStopWordsSet;
    }
    return Stopwords.getStopWords();
  }
}
