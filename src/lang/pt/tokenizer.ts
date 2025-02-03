import { TokenizerOptions } from "../../interfaces/ITokenizer";
import { Tokenizer as CoreTokenizer } from "../../tokenizer";
import { Stopwords } from "./stopwords/stopwords";

/**
 * Brazilian Portuguese tokenizer.
 * Extends the core tokenizer with Portuguese-specific stop words.
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
