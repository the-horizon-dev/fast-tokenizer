import { SentimentAnalyzer } from "../index";

describe("Sentiment Analysis", () => {
  let analyzer: SentimentAnalyzer;

  beforeEach(() => {
    analyzer = new SentimentAnalyzer();
  });

  test("analyzes English text and returns valid sentiment result", () => {
    const text = "I absolutely love this product!";
    const result = analyzer.analyze(text, "en");

    // Expect the result to have all properties defined.
    expect(result).toHaveProperty("score");
    expect(result).toHaveProperty("comparative");
    expect(Array.isArray(result.tokens)).toBe(true);
    expect(Array.isArray(result.words)).toBe(true);
    expect(Array.isArray(result.positive)).toBe(true);
    expect(Array.isArray(result.negative)).toBe(true);
  });

  test("analyzes Portuguese text and returns valid sentiment result", () => {
    const text = "Eu não gosto deste lugar";
    const result = analyzer.analyze(text, "pt");

    // Verify that tokens are processed and the expected properties exist.
    expect(result.tokens.length).toBeGreaterThan(0);
    expect(typeof result.score).toBe("number");
  });

  test("defaults to English when no language is provided", () => {
    const text = "This is a neutral sentence.";
    const result = analyzer.analyze(text);
    expect(result).toHaveProperty("tokens");
  });

  test("handles empty text input", () => {
    const result = analyzer.analyze("");
    expect(result.score).toBe(0);
    expect(result.tokens).toHaveLength(0);
  });

  test("handles unknown language gracefully", () => {
    const text = "Some sample text";
    const result = analyzer.analyze(text, "xx");
    expect(result).toBeDefined();
    expect(Array.isArray(result.tokens)).toBe(true);
  });

  test("processes Spanish text with diacritics", () => {
    const text = "¡Qué día más bonito!";
    const result = analyzer.analyze(text, "es");
    expect(result.tokens.length).toBeGreaterThan(0);
  });

  test("handles mixed language input", () => {
    const text = "Hello mundo! This es un test mixto.";
    const result = analyzer.analyze(text, "en");
    expect(result.tokens.length).toBeGreaterThan(0);
  });
});
