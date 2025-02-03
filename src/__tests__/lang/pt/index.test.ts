import { LangPt, Tokenizer, Stemmer, Stopwords, Normalizer } from "../../../lang/pt";
import { Container } from "../../../interfaces/ILanguageModule";
import { jest } from '@jest/globals';

describe("Portuguese Language Module", () => {
  test("registers all components", () => {
    const mockUse = jest.fn();
    const mockContainer = {
      use: mockUse
    } as unknown as Container;

    LangPt.register(mockContainer);

    expect(mockUse).toHaveBeenCalledWith(Tokenizer);
    expect(mockUse).toHaveBeenCalledWith(Stemmer);
    expect(mockUse).toHaveBeenCalledWith(Stopwords);
    expect(mockUse).toHaveBeenCalledWith(Normalizer);
  });

  test("static and instance registration are equivalent", () => {
    const mockUse1 = jest.fn();
    const mockUse2 = jest.fn();
    const container1 = { use: mockUse1 } as unknown as Container;
    const container2 = { use: mockUse2 } as unknown as Container;

    LangPt.register(container1);
    new LangPt().register(container2);

    expect(mockUse1.mock.calls).toEqual(mockUse2.mock.calls);
  });

  test("components are properly configured for Portuguese", () => {
    const tokenizer = new Tokenizer();
    const stemmer = new Stemmer();
    
    const tokens = tokenizer.tokenize("falando português");
    expect(tokens).toEqual(["falando", "portugues"]);
    
    expect(stemmer.stem("falando")).toBe("fal");
    expect(Stopwords.isStopword("de")).toBe(true);
    expect(Normalizer.normalize("olá  mundo")).toBe("olá mundo");
  });

  test("exports all required components", () => {
    expect(LangPt.Tokenizer).toBe(Tokenizer);
    expect(LangPt.Stemmer).toBe(Stemmer);
    expect(new Tokenizer()).toBeInstanceOf(Tokenizer);
    expect(new Stemmer()).toBeInstanceOf(Stemmer);
    expect(Stopwords.getStopWords()).toBeInstanceOf(Set);
  });
});
