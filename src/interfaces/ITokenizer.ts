/**
 * Configuration options for text tokenization process.
 * 
 * @property lowercase - Convert text to lowercase
 * @property removeDiacritics - Remove diacritical marks
 * @property removeStopWords - Filter out common stop words
 * @property removeNumbers - Remove numeric content
 * @property minLength - Minimum token length to keep
 * @property maxLength - Maximum token length to keep
 * @property customStopWords - Additional words to filter
 * @property languageStopWordsSet - Pre-configured stop words set
 */
export interface TokenizerOptions {
  lowercase?: boolean;
  removeDiacritics?: boolean;
  removeStopWords?: boolean;
  removeNumbers?: boolean;
  minLength?: number;
  maxLength?: number;
  customStopWords?: string[];
  languageStopWordsSet?: ReadonlySet<string>;
}

/**
 * Core tokenizer interface defining text processing operations.
 * 
 * @interface ITokenizer
 */
export interface ITokenizer {
  /**
   * Splits text into tokens based on configuration options.
   */
  tokenize(text: string, options?: TokenizerOptions): string[];
  
  /**
   * Combines tokens back into a single text string.
   */
  join(tokens: string[]): string;
  
  /**
   * Divides text into fixed-size token chunks.
   */
  chunk(text: string, size: number, options?: TokenizerOptions): string[];
}
