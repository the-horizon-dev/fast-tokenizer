import { Tokenizer } from "../../../lang/es/tokenizer";

describe("Spanish Tokenizer", () => {
  test("static tokenize method works correctly", () => {
    const text = "¡Hola mundo!";
    const tokens = Tokenizer.tokenize(text);
    expect(tokens).toEqual(["hola", "mundo"]);
  });

  test("handles Spanish-specific characters", () => {
    const text = "año niño señor español";
    const tokens = new Tokenizer().tokenize(text);
    expect(tokens).toEqual(["ano", "nino", "senor", "espanol"]);
  });

  test("uses custom stop words set when provided", () => {
    const tokenizer = new Tokenizer();
    const customSet = new Set(["el", "la", "los", "las"]);
    const text = "el gato y la gata";
    const tokens = tokenizer.tokenize(text, { 
      removeStopWords: true,
      languageStopWordsSet: customSet 
    });
    expect(tokens).toEqual(["gato", "gata"]);
  });

  test("handles Spanish punctuation marks", () => {
    const text = "¿Qué tal? ¡Muy bien!";
    const tokens = new Tokenizer().tokenize(text);
    expect(tokens).toEqual(["tal", "bien"]);
  });
});
