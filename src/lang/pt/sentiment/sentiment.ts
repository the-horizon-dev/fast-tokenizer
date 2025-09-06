import afinn from "./afinn.json";
import negations from "./negations.json";

/**
 * Provides Brazilian Portuguese sentiment analysis data.
 */
export const Sentiment = {
  afinn,
  negations,
  stemmed: true,
};
