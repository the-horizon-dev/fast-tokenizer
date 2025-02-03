import { Stemmer } from "../../../lang/en/stemmer";

describe("English Stemmer Edge Cases", () => {
  let stemmer: Stemmer;

  beforeEach(() => {
    stemmer = new Stemmer();
  });

  test("handles words ending in 'sses'", () => {
    expect(stemmer.stem("dresses")).toBe("dress");
  });

  test("handles words ending in 'ies'", () => {
    expect(stemmer.stem("ponies")).toBe("pony");
  });

  test("handles words with 'ization' suffix", () => {
    expect(stemmer.stem("modernization")).toBe("modernize");
  });

  test("handles words with 'ational' suffix", () => {
    expect(stemmer.stem("rational")).toBe("rate");
  });

  test("handles words with 'fulness' suffix", () => {
    expect(stemmer.stem("gracefulness")).toBe("graceful");
  });

  test("handles words with 'ousness' suffix", () => {
    expect(stemmer.stem("hazardousness")).toBe("hazardous");
  });

  test("handles double consonants at the end", () => {
    expect(stemmer.stem("fall")).toBe("fall"); // Should not change 'll'
    expect(stemmer.stem("buzz")).toBe("buzz"); // Should not change 'zz'
    expect(stemmer.stem("matt")).toBe("mat");  // Should change 'tt'
  });
});
