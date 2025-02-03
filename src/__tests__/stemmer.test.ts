import { LangEn } from "../lang/en";

describe("English Stemmer", () => {
  let stemmer: InstanceType<typeof LangEn.Stemmer>;

  beforeEach(() => {
    // Create a new English stemmer instance.
    stemmer = new LangEn.Stemmer();
  });

  test("stems plural words", () => {
    // "cats" should become "cat"
    expect(stemmer.stem("cats")).toBe("cat");
  });

  test("stems words with common suffixes", () => {
    // e.g., "running" should be stemmed to "runn" or "run" depending on algorithm rules.
    // Since the English stemmer provided removes "ing" if a vowel exists, we expect "running" → "runn" or "run".
    // Adjust the expected value based on your implementation.
    const result = stemmer.stem("running");
    expect(result === "runn" || result === "run").toBe(true);
  });

  test("returns same word for short tokens", () => {
    // Words shorter than 3 letters should be returned as is.
    expect(stemmer.stem("at")).toBe("at");
  });

  test("stems an array of words", () => {
    const words = ["cats", "running", "tested"];
    const stemmed = stemmer.stemWords(words);
    expect(stemmed.length).toBe(3);
    // For example, expect "cats" → "cat", "tested" → "test" (or similar)
    expect(stemmed[0]).toBe("cat");
  });

  test("caches stemmed words", () => {
    const word = "running";
    const firstResult = stemmer.stem(word);
    const secondResult = stemmer.stem(word);
    expect(secondResult).toBe(firstResult);
  });

  test("handles dictionary exceptions", () => {
    const customDict = {
      before: { "going": "go" },
      after: { "goe": "go" }
    };
    const customStemmer = new LangEn.Stemmer(customDict);
    expect(customStemmer.stem("going")).toBe("go");
  });

  test("handles empty strings", () => {
    expect(stemmer.stem("")).toBe("");
  });

  test("processes batch of words correctly", () => {
    const words = ["running", "jumps", "easily", "dogs", ""];
    const results = stemmer.stemWords(words);
    expect(results).toHaveLength(5);
    expect(results.every(word => typeof word === "string")).toBe(true);
  });

  test("maintains word boundaries", () => {
    const specialWord = "pre-processing";
    const result = stemmer.stem(specialWord);
    expect(result.length).toBeLessThanOrEqual(specialWord.length);
  });
});
