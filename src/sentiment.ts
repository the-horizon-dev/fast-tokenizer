import { SentimentResult, ISentiment } from "./interfaces/ISentiment";
import { LangEn } from "./lang/en";
import { LangEs } from "./lang/es";
import { LangPt } from "./lang/pt";

type LanguageModule = {
  Tokenizer: new () => { tokenize(text: string): string[] };
  Stemmer: new () => { stem(word: string): string };
};

export class BaseSentiment implements ISentiment {
  public analyze(text: string, lang = "en"): SentimentResult {
    let langModule: LanguageModule;

    // Select language-specific modules based on the language code
    switch (lang.toLowerCase()) {
      case "pt":
        langModule = LangPt;
        break;
      case "es":
        langModule = LangEs;
        break;
      case "en":
      default:
        langModule = LangEn;
        break;
    }

    if (!text) {
      return {
        score: 0,
        comparative: 0,
        tokens: [],
        words: [],
        positive: [],
        negative: [],
      };
    }

    // Tokenize the text using the language‑specific tokenizer
    const tokenizer = new langModule.Tokenizer();
    const tokens = tokenizer.tokenize(text);

    // Process tokens with a single stemmer instance
    const stemmer = new langModule.Stemmer();
    const processedTokens = tokens.map((token) => stemmer.stem(token));

    // Simplified result without sentiment analysis
    return {
      score: 0,
      comparative: 0,
      tokens: processedTokens,
      words: [],
      positive: [],
      negative: [],
    };
  }
}