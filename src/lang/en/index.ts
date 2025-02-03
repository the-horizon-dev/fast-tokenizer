import { Tokenizer } from "./tokenizer";
import { Stemmer } from "./stemmer";
import { Stopwords } from "./stopwords/stopwords";
import { Normalizer } from "./normalizer";
import { Sentiment } from "./sentiment/sentiment";
import { ILanguageModule, Container } from "../../interfaces/ILanguageModule";

/**
 * Language module for English.
 * Implements ILanguageModule and registers components in a dependency container.
 */
export class LangEn implements ILanguageModule {
  /**
   * Registers English language components.
   *
   * @param container - A dependency container with type-safe methods.
   */
  public static readonly Tokenizer = Tokenizer;
  public static readonly Stemmer = Stemmer;

  public register(container: Container): void {
    LangEn.register(container);
  }

  /**
   * Registers components into the provided container.
   *
   * @param container - A dependency container.
   */
  public static register(container: Container): void {
    container.use(Tokenizer);
    container.use(Stemmer);
    container.use(Stopwords);
    container.use(Normalizer);
    // Additional registrations (e.g. trigram models) can be added here.
  }
}

export { Tokenizer, Stemmer, Stopwords, Normalizer, Sentiment };
