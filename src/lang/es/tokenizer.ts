import { TokenizerOptions } from "../../interfaces/ITokenizer";
import { Tokenizer as CoreTokenizer } from "../../tokenizer";
import { Stopwords } from "./stopwords/stopwords";

/**
 * Spanish-specific tokenizer implementation.
 * Extends the core tokenizer with Spanish language support.
 */
export class Tokenizer extends CoreTokenizer {
  public static tokenize(text: string, options?: TokenizerOptions): string[] {
    return new Tokenizer().tokenize(text, options);
  }

  protected getStopWords(options?: TokenizerOptions): ReadonlySet<string> {
    if (options?.languageStopWordsSet) {
      return options.languageStopWordsSet;
    }
    return Stopwords.getStopWords();
  }
}
