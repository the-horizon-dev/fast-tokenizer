import senticon from "./senticon.json";
import negations from "./negations.json";
import afinn from "./afinn.json";

/**
 * Provides Spanish sentiment analysis data.
 */
export const Sentiment = {
  afinn,
  senticon,
  negations,
  stemmed: true,
};
