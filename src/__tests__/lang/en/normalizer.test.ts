import { Normalizer } from "../../../lang/en/normalizer";

describe("English Normalizer", () => {
  test("normalizes text with multiple spaces", () => {
    const text = "  Hello   world  ";
    expect(Normalizer.normalize(text)).toBe("Hello world");
  });

  test("normalizes text with tabs and newlines", () => {
    const text = "Hello\t\tworld\n\ntest";
    expect(Normalizer.normalize(text)).toBe("Hello world test");
  });

  test("handles empty string", () => {
    expect(Normalizer.normalize("")).toBe("");
  });

  test("handles string with only whitespace", () => {
    expect(Normalizer.normalize("   \t\n   ")).toBe("");
  });
});
