import { LangEs, Tokenizer, Stemmer, Stopwords, Normalizer } from "../../../lang/es";
import { Container } from "../../../interfaces/ILanguageModule";
import { jest } from '@jest/globals';

describe("Spanish Language Module", () => {
  test("registers all components", () => {
    const mockUse = jest.fn();
    const mockContainer = {
      use: mockUse
    } as unknown as Container;

    LangEs.register(mockContainer);

    expect(mockUse).toHaveBeenCalledWith(Tokenizer);
    expect(mockUse).toHaveBeenCalledWith(Stemmer);
    expect(mockUse).toHaveBeenCalledWith(Stopwords);
    expect(mockUse).toHaveBeenCalledWith(Normalizer);
  });

  test("instance register method is equivalent to static", () => {
    const mockUse1 = jest.fn();
    const mockUse2 = jest.fn();
    const container1 = { use: mockUse1 } as unknown as Container;
    const container2 = { use: mockUse2 } as unknown as Container;

    new LangEs().register(container1);
    LangEs.register(container2);

    expect(mockUse1.mock.calls).toEqual(mockUse2.mock.calls);
  });

  test("exports all required components", () => {
    expect(new Tokenizer()).toBeInstanceOf(Tokenizer);
    expect(new Stemmer()).toBeInstanceOf(Stemmer);
    expect(Stopwords.getStopWords()).toBeInstanceOf(Set);
    expect(Normalizer.normalize("test")).toBe("test");
  });

  test("components are properly configured for Spanish", () => {
    const tokenizer = new Tokenizer();
    const stemmer = new Stemmer();
    
    const tokens = tokenizer.tokenize("¡Hola mundo!");
    expect(tokens).toEqual(["hola", "mundo"]);
    
    expect(stemmer.stem("caminando")).toBe("camin");
    expect(Stopwords.isStopword("el")).toBe(true);
    expect(Normalizer.normalize("¿Qué tal?")).toBe("¿Qué tal?");
  });
});
