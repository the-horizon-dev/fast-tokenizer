import { Normalizer } from "../../../lang/pt/normalizer";

describe("Portuguese Normalizer", () => {
  test("normalizes text with diacritics", () => {
    const text = "  João   não   maçã  ";
    expect(Normalizer.normalize(text)).toBe("João não maçã");
  });

  test("handles multiple spaces and line breaks", () => {
    const text = "Olá\n\nmundo!\t\tComo\nvai?";
    expect(Normalizer.normalize(text)).toBe("Olá mundo! Como vai?");
  });

  test("preserves Portuguese characters", () => {
    const text = "  ç  ã  õ  á  é  í  ó  ú  à  ";
    expect(Normalizer.normalize(text)).toBe("ç ã õ á é í ó ú à");
  });
});
