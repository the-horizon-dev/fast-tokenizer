import { Stemmer } from "../../../lang/es/stemmer";

describe("Spanish Stemmer", () => {
  let stemmer: Stemmer;

  beforeEach(() => {
    stemmer = new Stemmer();
  });

  test("handles plural forms", () => {
    expect(stemmer.stem("gatos")).toBe("gato");
    expect(stemmer.stem("luces")).toBe("luz");
    expect(stemmer.stem("naciones")).toBe("nacion");
  });

  test("handles verb forms", () => {
    expect(stemmer.stem("caminando")).toBe("camin");
    expect(stemmer.stem("comiendo")).toBe("comi");
    expect(stemmer.stem("hablado")).toBe("habl");
    expect(stemmer.stem("corrido")).toBe("cor");
  });

  test("handles infinitives", () => {
    expect(stemmer.stem("hablar")).toBe("habl");
    expect(stemmer.stem("comer")).toBe("com");
    expect(stemmer.stem("vivir")).toBe("viv");
  });

  test("handles adverbs with 'mente'", () => {
    expect(stemmer.stem("rápidamente")).toBe("rápida");
    expect(stemmer.stem("felizmente")).toBe("feliz");
  });

  test("maintains word boundaries for short words", () => {
    expect(stemmer.stem("sol")).toBe("sol");
    expect(stemmer.stem("luz")).toBe("luz");
    expect(stemmer.stem("paz")).toBe("paz");
  });
});
