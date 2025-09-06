import { Tokenizer } from "./tokenizer.js";
import { Stemmer } from "./stemmer.js";
import { Stopwords } from "./stopwords/stopwords.js";
import { Normalizer } from "./normalizer.js";
import { ILanguageModule, Container } from "../../interfaces/ILanguageModule.js";

/**
 * Language module for Brazilian Portuguese.
 * Implements ILanguageModule and registers components in a dependency container.
 */
export class LangPt implements ILanguageModule {
  public static readonly Tokenizer = Tokenizer;
  public static readonly Stemmer = Stemmer;

  public register(container: Container): void {
    LangPt.register(container);
  }

  public static register(container: Container): void {
    container.use(Tokenizer);
    container.use(Stemmer);
    container.use(Stopwords);
    container.use(Normalizer);
  }
}

export { Tokenizer, Stemmer, Stopwords, Normalizer };
