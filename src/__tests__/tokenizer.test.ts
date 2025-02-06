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

describe("Tokenizer - ngrams", () => {
  it("should return an empty array for an empty string", () => {
    const result = Tokenizer.getNGrams("", 3, true);
    expect(result).toEqual([]);
  });

  it("should return an empty array when the padded string is shorter than n", () => {
    // Given that the function pads with a space on both ends,
    // even a one-letter input becomes " a " which is 3 characters.
    // So we need a string that results in a padded length less than n.
    // In practice, this scenario is hard to trigger because n=3 is the default.
    // We simulate with n greater than the padded string length.
    const result = Tokenizer.getNGrams("ab", 5, true);
    expect(result).toEqual([]);
  });

  it("should generate correct n-grams as joined strings (default behavior)", () => {
    // Example: input "abcde"
    // Cleaned and lowercased: "abcde"
    // Padded value: " abcde " (length 7)
    // For n=3, we expect:
    // i=0: " ab"  (space, a, b)
    // i=1: "abc"
    // i=2: "bcd"
    // i=3: "cde"
    // i=4: "de "  (d, e, space)
    const input = "abcde";
    const expected = [" ab", "abc", "bcd", "cde", "de "];
    const result = Tokenizer.getNGrams(input, 3, true);
    expect(result).toEqual(expected);
  });

  it("should generate correct n-grams as arrays of characters when joinTokens is false", () => {
    // Using the same example as above with joinTokens set to false.
    const input = "abcde";
    const expected = [
      [" ", "a", "b"],
      ["a", "b", "c"],
      ["b", "c", "d"],
      ["c", "d", "e"],
      ["d", "e", " "],
    ];
    const result = Tokenizer.getNGrams(input, 3, false);
    expect(result).toEqual(expected);
  });

  it("should remove diacritics, punctuation, collapse whitespace and lowercase the input", () => {
    // For example, the input "Héllo,   World!!" should be cleaned to "hello world"
    // and then padded: " hello world "
    // For n=3, the generated n-grams (as joined strings) are computed over the padded string.
    const input = "Héllo,   World!!";
    // Clean process:
    //   - Diacritics removal: "Hello,   World!!"
    //   - Punctuation replaced: "Hello    World  " -> collapse spaces: "Hello World"
    //   - Lowercased and trimmed: "hello world"
    //   - Padded: " hello world "
    // For n=3, the ngrams would be:
    // [" he", "hel", "ell", "llo", "lo ", "o w", " wo", "wor", "orl", "rld", "ld "]
    const expected = [" he", "hel", "ell", "llo", "lo ", "o w", " wo", "wor", "orl", "rld", "ld "];
    const result = Tokenizer.getNGrams(input, 3, true);
    expect(result).toEqual(expected);
  });

  it("should support different n values", () => {
    // Test with n=2 (bigrams)
    // For input "abc", padded becomes " abc ", length 5, so bigrams:
    // i=0: " a", i=1: "ab", i=2: "bc", i=3: "c "
    const input = "abc";
    const expectedBigrams = [" a", "ab", "bc", "c "];
    const resultBigrams = Tokenizer.getNGrams(input, 2, true);
    expect(resultBigrams).toEqual(expectedBigrams);

    // Test with n=4
    // For input "abcd", padded becomes " abcd ", length 6, so 4-grams:
    // i=0: " abc", i=1: "abcd", i=2: "bcd "
    const input2 = "abcd";
    const expectedFourgrams = [" abc", "abcd", "bcd "];
    const resultFourgrams = Tokenizer.getNGrams(input2, 4, true);
    expect(resultFourgrams).toEqual(expectedFourgrams);
  });
});
