import { Tokenizer } from "../../../lang/en/tokenizer";

describe("English Tokenizer", () => {
  test("static tokenize method works correctly", () => {
    const text = "Hello world!";
    const tokens = Tokenizer.tokenize(text);
    expect(tokens).toEqual(["hello", "world"]);
  });

  test("uses custom stop words set when provided", () => {
    const tokenizer = new Tokenizer();
    const customSet = new Set(["custom", "stop", "words"]);
    const text = "these are custom stop words";
    const tokens = tokenizer.tokenize(text, { 
      removeStopWords: true,
      languageStopWordsSet: customSet 
    });
    expect(tokens).not.toContain("custom");
    expect(tokens).not.toContain("stop");
    expect(tokens).not.toContain("words");
  });

  test("uses default stop words when no custom set provided", () => {
    const tokenizer = new Tokenizer();
    const text = "the and but";
    const tokens = tokenizer.tokenize(text, { removeStopWords: true });
    expect(tokens).toEqual([]);
  });
});
