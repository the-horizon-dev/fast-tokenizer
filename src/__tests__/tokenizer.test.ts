import { Tokenizer } from "../tokenizer";

describe("Tokenizer", () => {
  let tokenizer: Tokenizer;

  beforeEach(() => {
    // Create a tokenizer instance with default options.
    tokenizer = new Tokenizer({ lowercase: true, removeStopWords: false });
  });

  test("tokenizes text into words", () => {
    const text = "Hello, world! This is a test.";
    const tokens = tokenizer.tokenize(text);
    // Punctuation is removed, and text is lowercased.
    expect(tokens).toEqual(["hello", "world", "this", "is", "test"]);
  });

  test("filters tokens by minimum length", () => {
    const text = "a bb ccc dddd";
    const tokens = tokenizer.tokenize(text, { minLength: 3 });
    // Only tokens with 3 or more characters should be returned.
    expect(tokens).toEqual(["ccc", "dddd"]);
  });

  test("joins tokens into a string", () => {
    const tokens = ["hello", "world", "test"];
    const joined = tokenizer.join(tokens);
    expect(joined).toBe("hello world test");
  });

  test("chunks tokens into groups", () => {
    const text = "one two three four five six";
    const chunks = tokenizer.chunk(text, 2);
    // Expect each chunk to contain two tokens (except possibly the last chunk).
    expect(chunks).toEqual(["one two", "three four", "five six"]);
  });

  test("throws an error for non-string input", () => {
    // @ts-expect-error: Testing runtime error for non-string input.
    expect(() => tokenizer.tokenize(123)).toThrow(TypeError);
  });

  test("handles empty string input", () => {
    const text = "";
    const tokens = tokenizer.tokenize(text);
    expect(tokens).toEqual([]);
  });

  test("handles whitespace-only input", () => {
    const text = "   \t\n   ";
    const tokens = tokenizer.tokenize(text);
    expect(tokens).toEqual([]);
  });

  test("respects maxLength option", () => {
    const text = "short verylongword extremelylongword";
    const tokens = tokenizer.tokenize(text, { maxLength: 10 });
    expect(tokens).toEqual(["short"]);
  });

  test("handles custom stop words", () => {
    const text = "this is a custom stop word test";
    const tokens = tokenizer.tokenize(text, {
      removeStopWords: true,
      customStopWords: ["custom", "test"]
    });
    expect(tokens).not.toContain("custom");
    expect(tokens).not.toContain("test");
  });

  test("processes text with diacritics", () => {
    const text = "résumé café piñata";
    const tokens = tokenizer.tokenize(text, { removeDiacritics: true });
    expect(tokens).toContain("resume");
    expect(tokens).toContain("cafe");
    expect(tokens).toContain("pinata");
  });

  test("handles numbers correctly", () => {
    const text = "test123 456test test-123 123";
    const tokensWithNumbers = tokenizer.tokenize(text, { removeNumbers: false });
    const tokensWithoutNumbers = tokenizer.tokenize(text, { removeNumbers: true });
    
    expect(tokensWithNumbers).toContain("test123");
    expect(tokensWithoutNumbers).not.toContain("test123");
  });

  test("removes all types of punctuation", () => {
    const text = "Hello... «world» \"test\" 'quote' ¡hola! ¿qué? test's";
    const tokens = tokenizer.tokenize(text);
    expect(tokens).toEqual(["hello", "world", "test", "quote", "hola", "que", "test"]);
  });

  test("removes all types of diacritics", () => {
    const text = "crème brûlée café piñata äëïöü àèìòù";
    const tokens = tokenizer.tokenize(text, { removeDiacritics: true });
    expect(tokens).toEqual(["creme", "brulee", "cafe", "pinata", "aeiou", "aeiou"]);
  });

  test("handles mixed punctuation and diacritics", () => {
    const text = "¡Hôtel-Café! L'état, l'être.";
    const tokens = tokenizer.tokenize(text, { removeDiacritics: true });
    expect(tokens).toEqual(["hotel", "cafe", "etat", "etre"]);
  });
});

describe("Tokenizer - getTrigrams", () => {
  let tokenizer: Tokenizer;

  beforeEach(() => {
    // Create a tokenizer instance with default options.
    tokenizer = new Tokenizer({ lowercase: true, removeStopWords: false });
  });

  test("returns an empty array when input text is empty", () => {
    const trigrams = tokenizer.getTrigrams("");
    expect(trigrams).toEqual([]);
  });

  test("returns an empty array when there are not enough tokens for one trigram", () => {
    // Only one token
    const trigrams = tokenizer.getTrigrams("Hello");
    expect(trigrams).toEqual([]);
  });

  test("returns correct trigrams as arrays of tokens", () => {
    const text = "The quick brown fox jumps over the lazy dog";
    // Tokenized text: ["the", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"]
    const expected = [
      ["the", "quick", "brown"],
      ["quick", "brown", "fox"],
      ["brown", "fox", "jumps"],
      ["fox", "jumps", "over"],
      ["jumps", "over", "the"],
      ["over", "the", "lazy"],
      ["the", "lazy", "dog"]
    ];
    const trigrams = tokenizer.getTrigrams(text);
    expect(trigrams).toEqual(expected);
  });

  test("returns trigrams as joined strings when joinTokens is true", () => {
    const text = "one two three four";
    // Tokenized text: ["one", "two", "three", "four"]
    // Expected joined trigrams: ["one two three", "two three four"]
    const expected = ["one two three", "two three four"];
    const trigrams = tokenizer.getTrigrams(text, {}, 3, true);
    expect(trigrams).toEqual(expected);
  });

  test("allows custom n-gram sizes (e.g., bigrams)", () => {
    const text = "a b c d";
    // Override the minLength to 1 so that single-character tokens are not filtered out.
    const expected = [["a", "b"], ["b", "c"], ["c", "d"]];
    const bigrams = tokenizer.getTrigrams(text, { minLength: 1 }, 2, false);
    expect(bigrams).toEqual(expected);
  });

  test("allows custom n-gram sizes (e.g., 4-grams) as joined strings", () => {
    const text = "one two three four five";
    // Tokenized text: ["one", "two", "three", "four", "five"]
    // Expected 4-grams (joined): ["one two three four", "two three four five"]
    const expected = ["one two three four", "two three four five"];
    const fourGrams = tokenizer.getTrigrams(text, {}, 4, true);
    expect(fourGrams).toEqual(expected);
  });
});