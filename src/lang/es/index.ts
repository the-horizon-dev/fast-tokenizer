import { Tokenizer } from "./tokenizer";
import { Stemmer } from "./stemmer";
import { Stopwords } from "./stopwords/stopwords";
import { Normalizer } from "./normalizer";
import { ILanguageModule, Container } from "../../interfaces/ILanguageModule";

/**
 * Language module for Spanish.
 * Implements ILanguageModule and registers components in a dependency container.
 */
export class LangEs implements ILanguageModule {
  public static readonly Tokenizer = Tokenizer;
  public static readonly Stemmer = Stemmer;

  public register(container: Container): void {
    LangEs.register(container);
  }

  public static register(container: Container): void {
    container.use(Tokenizer);
    container.use(Stemmer);
    container.use(Stopwords);
    container.use(Normalizer);
  }
}

export { Tokenizer, Stemmer, Stopwords, Normalizer };
