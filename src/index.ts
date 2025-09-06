export { Tokenizer } from "./tokenizer.js";
export type { TokenizerOptions } from "./interfaces/ITokenizer.js";

// Language-specific exports:
export * as LangEn from "./lang/en/index.js";
export * as LangEs from "./lang/es/index.js";
export * as LangPt from "./lang/pt/index.js";

// Expose the sentiment analysis module.
export { BaseSentiment as SentimentAnalyzer } from "./sentiment.js";