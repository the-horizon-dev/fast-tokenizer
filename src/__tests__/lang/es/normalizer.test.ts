import { Normalizer } from "../../../lang/es/normalizer";

describe("Spanish Normalizer", () => {
  test("normalizes Spanish text with diacritics", () => {
    const text = "  ¿Cómo   estás?\n¡Muy   bien!  ";
    expect(Normalizer.normalize(text)).toBe("¿Cómo estás? ¡Muy bien!");
  });

  test("handles Spanish punctuation", () => {
    const text = "¿Hola!\t\n¡Mundo?";
    expect(Normalizer.normalize(text)).toBe("¿Hola! ¡Mundo?");
  });

  test("handles empty string", () => {
    expect(Normalizer.normalize("")).toBe("");
  });

  test("preserves Spanish characters", () => {
    const text = "  ñ  á  é  í  ó  ú  ü  ";
    expect(Normalizer.normalize(text)).toBe("ñ á é í ó ú ü");
  });
});
