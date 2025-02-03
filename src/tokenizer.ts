import { Diacritics } from "@the-horizon-dev/fast-diacritics";
import { ITokenizer, TokenizerOptions } from "./interfaces/ITokenizer";

/**
 * A high-performance text tokenizer with configurable options.
 * Implements the Template Method pattern for flexible tokenization logic.
 * 
 * Features:
 * - Case normalization
 * - Diacritic removal
 * - Stop word filtering
 * - Number removal
 * - Length-based filtering
 * - Custom stop word support
 * 
 * @implements {ITokenizer}
 * 
 * @example
 * ```typescript
 * // Create a tokenizer instance with default options.
 * const tokenizer = new Tokenizer({ lowercase: true, removeStopWords: true });
 * const text = "Hello, world! This is a sample text.";
 * const tokens = tokenizer.tokenize(text, { minLength: 3 });
 * console.log(tokens);
 * ```
 */
export class Tokenizer implements ITokenizer {
  private readonly defaultOptions: TokenizerOptions;
  private static readonly BASE_OPTIONS: TokenizerOptions = {
    lowercase: true,
    removeDiacritics: true,
    removeStopWords: true,
    removeNumbers: false,
    minLength: 2,
    maxLength: 50,
  };

  private static readonly PUNCTUATION_REGEX = /[!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~¡¿«»""''‹›„"'\u0027\u0022\u2018-\u201F\u00A1\u00BF]/g;
  private static readonly WHITESPACE_REGEX = /\s+/;
  private static readonly NUMBER_REGEX = /\d+/g;

  /**
   * Creates an instance of Tokenizer.
   *
   * @param defaultOptions - Default tokenization options that are applied on every call.
   */
  constructor(defaultOptions?: TokenizerOptions) {
    this.defaultOptions = { ...Tokenizer.BASE_OPTIONS, ...defaultOptions };
  }

  /**
   * Processes input text into tokens based on specified options.
   * The instance default options are merged with per‑call options.
   * 
   * @param text - Raw input text to tokenize.
   * @param options - Optional configuration options that override defaults.
   * @returns Array of processed tokens.
   * @throws {TypeError} If the input text is not a string.
   */
  public tokenize(text: string, options: TokenizerOptions = {}): string[] {
    // Merge instance defaults with per-call options.
    const opts: TokenizerOptions = { ...this.defaultOptions, ...options };

    if (typeof text !== "string") {
      throw new TypeError("Input text must be a string.");
    }

    let processedText = text;

    // Apply lowercase conversion.
    processedText = opts.lowercase ? processedText.toLowerCase() : processedText;
    // Remove diacritics.
    processedText = opts.removeDiacritics ? Diacritics.remove(processedText) : processedText;
    // Remove numbers.
    processedText = opts.removeNumbers
      ? processedText.replace(Tokenizer.NUMBER_REGEX, " ")
      : processedText;
    // Replace punctuation with spaces.
    processedText = processedText.replace(Tokenizer.PUNCTUATION_REGEX, " ");

    // Split text on whitespace.
    let tokens = processedText.split(Tokenizer.WHITESPACE_REGEX);
    // Filter tokens by length.
    tokens = tokens.filter((token: string): boolean => this.isValidToken(token, opts));

    // Remove stop words if enabled.
    return opts.removeStopWords ? this.filterStopWords(tokens, opts) : tokens;
  }

  /**
   * Joins an array of tokens into a single string.
   *
   * @param tokens - An array of tokens.
   * @returns A string of tokens separated by spaces.
   */
  public join(tokens: string[]): string {
    return tokens.join(" ");
  }

  /**
   * Splits the input text into chunks containing a specified number of tokens.
   *
   * @param text - The input text.
   * @param size - The number of tokens per chunk.
   * @returns An array of text chunks.
   */
  public chunk(text: string, size: number): string[] {
    const tokens: string[] = this.tokenize(text);
    const chunks: string[] = [];
    for (let i = 0; i < tokens.length; i += size) {
      chunks.push(tokens.slice(i, i + size).join(" "));
    }
    return chunks;
  }

  /**
   * Returns a set of stop words.
   *
   * Designed to be overridden by language-specific implementations.
   * By default, returns an empty set.
   *
   * @param _options - Optional tokenizer options.
   * @returns A readonly set of stop words.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getStopWords(_options?: TokenizerOptions): ReadonlySet<string> {
    return new Set();
  }

  /**
   * Validates a token based on length constraints.
   * 
   * @param token - Token to validate.
   * @param opts - Tokenization options containing length constraints.
   * @returns True if the token is valid; otherwise, false.
   */
  private isValidToken(token: string, opts: TokenizerOptions): boolean {
    if (!token) return false;
    if (opts.minLength !== undefined && token.length < opts.minLength) return false;
    if (opts.maxLength !== undefined && token.length > opts.maxLength) return false;
    return true;
  }

  /**
   * Filters out stop words from an array of tokens.
   * 
   * @param tokens - Array of tokens to filter.
   * @param opts - Tokenization options containing stop word configurations.
   * @returns Filtered array of tokens.
   */
  private filterStopWords(tokens: string[], opts: TokenizerOptions): string[] {
    const languageStopWords: ReadonlySet<string> = this.getStopWords(opts);
    const customStopWords: ReadonlySet<string> = new Set(opts.customStopWords ?? []);
    const allStopWords: ReadonlySet<string> = new Set([...languageStopWords, ...customStopWords]);
    return tokens.filter((token: string): boolean => !allStopWords.has(token));
  }
}
