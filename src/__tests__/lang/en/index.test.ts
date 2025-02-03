import { LangEn, Tokenizer, Stemmer, Stopwords, Normalizer, Sentiment } from "../../../lang/en";
import { Container } from "../../../interfaces/ILanguageModule";
import { jest } from '@jest/globals';

describe("English Language Module", () => {
  test("registers all components", () => {
    const container = {
      use: jest.fn()
    } as unknown as Container;

    LangEn.register(container);
    
    // Verify that all components are registered
    expect(container.use).toHaveBeenCalledTimes(4);
  });

  test("instance register method calls static register", () => {
    const langEn = new LangEn();
    const container = {
      use: jest.fn()
    } as unknown as Container;

    langEn.register(container);
    
    expect(container.use).toHaveBeenCalledTimes(4);
  });

  test("exports all required components", () => {
    expect(LangEn.Tokenizer).toBeDefined();
    expect(LangEn.Stemmer).toBeDefined();
  });

  test("all exported components are instantiable", () => {
    expect(new Tokenizer()).toBeInstanceOf(Tokenizer);
    expect(new Stemmer()).toBeInstanceOf(Stemmer);
    expect(Stopwords.getStopWords()).toBeInstanceOf(Set);
    expect(Normalizer.normalize("test")).toBe("test");
    expect(Sentiment).toBeDefined();
  });

  test("language module can be instantiated", () => {
    const langEn = new LangEn();
    expect(langEn).toBeInstanceOf(LangEn);
  });

  test("each component is registered exactly once", () => {
    const mockUse = jest.fn();
    const mockContainer = {
      use: mockUse
    } as unknown as Container;

    LangEn.register(mockContainer);

    expect(mockUse).toHaveBeenCalledWith(Tokenizer);
    expect(mockUse).toHaveBeenCalledWith(Stemmer);
    expect(mockUse).toHaveBeenCalledWith(Stopwords);
    expect(mockUse).toHaveBeenCalledWith(Normalizer);

    // Verify no duplicate registrations
    const uniqueCalls = new Set(mockUse.mock.calls.map(call => call[0]));
    expect(uniqueCalls.size).toBe(mockUse.mock.calls.length);
  });

  test("static and instance register methods are equivalent", () => {
    const mockUse1 = jest.fn();
    const mockUse2 = jest.fn();
    const container1 = { use: mockUse1 } as unknown as Container;
    const container2 = { use: mockUse2 } as unknown as Container;

    LangEn.register(container1);
    new LangEn().register(container2);

    expect(mockUse1.mock.calls).toEqual(mockUse2.mock.calls);
  });

  test("exported static components match registered ones", () => {
    expect(LangEn.Tokenizer).toBe(Tokenizer);
    expect(LangEn.Stemmer).toBe(Stemmer);
  });

  test("exported components are properly configured", () => {
    const tokenizer = new Tokenizer();
    const stemmer = new Stemmer();
    
    expect(tokenizer.tokenize("test")).toEqual(["test"]);
    expect(stemmer.stem("testing")).toBeTruthy();
    expect(Stopwords.isStopword("the")).toBe(true);
    expect(Normalizer.normalize("  test  ")).toBe("test");
  });
});
