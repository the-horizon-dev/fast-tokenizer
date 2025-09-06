import { Diacritics } from "@the-horizon-dev/fast-diacritics";
import type { ITokenizer, TokenizerOptions } from "./interfaces/ITokenizer.js";

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
 *
 * // Get trigrams as an array of token arrays:
 * const trigramArrays = tokenizer.getTrigrams(text);
 * console.log(trigramArrays);
 *
 * // Get trigrams as joined strings:
 * const trigramStrings = tokenizer.getTrigrams(text, {}, 3, true);
 * console.log(trigramStrings);
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

  private static readonly PUNCTUATION_REGEX =
    /[!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~¡¿«»""''‹›„"'\u0027\u0022\u2018-\u201F\u00A1\u00BF]/g;
  private static readonly WHITESPACE_REGEX = /\s+/;
  private static readonly NUMBER_REGEX = /\d+/g;
  private static readonly EMPTY_STOP_WORDS: ReadonlySet<string> = new Set();

  /**
   * Creates an instance of Tokenizer.
   *
   * @param defaultOptions - Default tokenization options that are applied on every call.
   */
  constructor(defaultOptions?: TokenizerOptions) {
    this.defaultOptions = { ...Tokenizer.BASE_OPTIONS, ...defaultOptions };
  }

  /**
   * Static convenience method for tokenizing using a temporary instance.
   *
   * @param text - Raw input text to tokenize.
   * @param options - Optional configuration options.
   * @returns Array of processed tokens.
   */
  public static tokenize(text: string, options: TokenizerOptions = {}): string[] {
    return new Tokenizer().tokenize(text, options);
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

    // Fast-path for empty or whitespace-only inputs
    if (!text || !text.trim()) {
      return [];
    }

    let processedText = text;

    // Apply lowercase conversion.
    processedText = opts.lowercase
      ? processedText.toLowerCase()
      : processedText;
    // Remove diacritics.
    processedText = opts.removeDiacritics
      ? Diacritics.remove(processedText)
      : processedText;
    // Remove numbers.
    processedText = opts.removeNumbers
      ? processedText.replace(Tokenizer.NUMBER_REGEX, " ")
      : processedText;
    // Replace punctuation with spaces.
    processedText = processedText.replace(Tokenizer.PUNCTUATION_REGEX, " ");

    // Trim once after normalization and punctuation replacement to avoid empty tokens
    processedText = processedText.trim();
    if (processedText.length === 0) {
      return [];
    }

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
   * @param options - Optional tokenization options applied before chunking.
   * @returns An array of text chunks.
   */
  public chunk(text: string, size: number, options: TokenizerOptions = {}): string[] {
    // Guard against invalid sizes to avoid infinite loops or exceptions
    if (!Number.isInteger(size) || size <= 0) {
      return [];
    }

    const tokens: string[] = this.tokenize(text, options);
    const chunks: string[] = [];
    for (let i = 0; i < tokens.length; i += size) {
      chunks.push(tokens.slice(i, i + size).join(" "));
    }
    return chunks;
  }

  /**
   * Returns an array of n-grams from the given source value.
   *
   * This method operates at the character level. It:
   * - Removes diacritics.
   * - Replaces punctuation (ASCII range 33-64) with a space and collapses multiple spaces.
   * - Trims, lowercases, and pads the text with a leading and trailing space.
   * - Extracts every overlapping sequence of n characters.
   *
   * @param srcValue - The source value to extract n-grams from.
   * @param n - The n‑gram size (default is 3).
   * @param joinTokens - If true, each n‑gram is returned as a single string; otherwise, as an array of characters.
   * @returns An array of n-grams, each either as an array of characters or as a joined string.
   */
  static getNGrams(
    srcValue: string,
    n = 3,
    joinTokens = true
  ): (string[] | string)[] {
    // Return an empty array for falsy or empty input.
    if (!srcValue) return [];
    // Guard for invalid n values
    if (!Number.isInteger(n) || n <= 0) return [];

    // Remove diacritics and convert the input to a string.
    const cleaned = Diacritics.remove(String(srcValue));

    // Replace punctuation (using the ASCII range for common punctuation) with a space,
    // collapse multiple spaces, trim, and convert to lowercase.
    const normalizedText = cleaned
      .replace(/[\u0021-\u0040]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    // Pad with a space on both sides.
    const paddedText = ` ${normalizedText} `;

    // If the padded text is shorter than n, return an empty array.
    if (paddedText.length < n) {
      return [];
    }

    const result: (string[] | string)[] = [];

    // Generate n-grams by sliding a window of length n over the padded text.
    for (let i = 0, len = paddedText.length - n + 1; i < len; i++) {
      const gram = paddedText.substring(i, i + n);
      result.push(joinTokens ? gram : gram.split(""));
    }

    return result;
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
    return Tokenizer.EMPTY_STOP_WORDS;
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
    if (opts.minLength !== undefined && token.length < opts.minLength)
      return false;
    if (opts.maxLength !== undefined && token.length > opts.maxLength)
      return false;
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
    const customStopWords: ReadonlySet<string> =
      opts.customStopWords && opts.customStopWords.length > 0
        ? new Set(opts.customStopWords)
        : Tokenizer.EMPTY_STOP_WORDS;

    // If there are no stop words at all, return the input tokens as-is
    if ((languageStopWords as Set<string>).size === 0 && (customStopWords as Set<string>).size === 0) {
      return tokens;
    }

    const filtered: string[] = [];
    for (const token of tokens) {
      if (!languageStopWords.has(token) && !customStopWords.has(token)) {
        filtered.push(token);
      }
    }
    return filtered;
  }
}
