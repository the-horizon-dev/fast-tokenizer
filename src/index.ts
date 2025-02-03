export { Tokenizer } from "./tokenizer";
export type { TokenizerOptions } from "./interfaces/ITokenizer";

// Language-specific exports:
export * as LangEn from "./lang/en";
export * as LangEs from "./lang/es";
export * as LangPt from "./lang/pt";

// Expose the sentiment analysis module.
export { BaseSentiment as SentimentAnalyzer } from "./sentiment";