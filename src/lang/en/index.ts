import { Tokenizer } from "./tokenizer.js";
import { Stemmer } from "./stemmer.js";
import { Stopwords } from "./stopwords/stopwords.js";
import { Normalizer } from "./normalizer.js";
import { Sentiment } from "./sentiment/sentiment.js";
import { ILanguageModule, Container } from "../../interfaces/ILanguageModule.js";

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
