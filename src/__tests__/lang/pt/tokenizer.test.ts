import { Tokenizer } from "../../../lang/pt/tokenizer";

describe("Portuguese Tokenizer", () => {
  test("static tokenize method works correctly", () => {
    const text = "Olá mundo!";
    const tokens = Tokenizer.tokenize(text);
    expect(tokens).toEqual(["ola", "mundo"]);
  });

  test("handles Portuguese-specific characters", () => {
    const text = "não maçã João coração";
    const tokens = new Tokenizer().tokenize(text);
    expect(tokens).toEqual(["nao", "maca", "joao", "coracao"]);
  });

  test("handles contractions", () => {
    const text = "d'água n'água";
    const tokens = new Tokenizer().tokenize(text);
    expect(tokens).toEqual(["agua", "agua"]);
  });

  test("uses custom stop words set", () => {
    const tokenizer = new Tokenizer();
    const customSet = new Set(["de", "do", "da", "dos", "das"]);
    const text = "casa de papel";
    const tokens = tokenizer.tokenize(text, { 
      removeStopWords: true,
      languageStopWordsSet: customSet 
    });
    expect(tokens).toEqual(["casa", "papel"]);
  });
});
