import { Stemmer } from "../../../lang/pt/stemmer";

describe("Portuguese Stemmer", () => {
  let stemmer: Stemmer;

  beforeEach(() => {
    stemmer = new Stemmer();
  });

  test("handles plural forms", () => {
    expect(stemmer.stem("limões")).toBe("limão");
    expect(stemmer.stem("cães")).toBe("cão");
    expect(stemmer.stem("casas")).toBe("casa");
  });

  test("handles verb conjugations", () => {
    expect(stemmer.stem("falando")).toBe("fal");
    expect(stemmer.stem("comendo")).toBe("com");
    expect(stemmer.stem("partindo")).toBe("part");
    expect(stemmer.stem("falado")).toBe("fal");
  });

  test("handles infinitives", () => {
    expect(stemmer.stem("falar")).toBe("fal");
    expect(stemmer.stem("comer")).toBe("com");
    expect(stemmer.stem("partir")).toBe("part");
  });

  test("handles adverbs with 'mente'", () => {
    expect(stemmer.stem("rapidamente")).toBe("rapida");
    expect(stemmer.stem("felizmente")).toBe("feliz");
  });

  test("maintains word boundaries for short words", () => {
    expect(stemmer.stem("paz")).toBe("paz");
    expect(stemmer.stem("sol")).toBe("sol");
    expect(stemmer.stem("luz")).toBe("luz");
  });

  test("stemWords processes multiple words", () => {
    const words = ["falando", "comendo", "partindo"];
    const stemmed = stemmer.stemWords(words);
    expect(stemmed).toEqual(["fal", "com", "part"]);
  });
});
