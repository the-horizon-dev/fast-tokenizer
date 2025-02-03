import senticon from "./senticon.json";
import negations from "./negations.json";

/**
 * Provides English sentiment analysis data.
 */
export const Sentiment = {
  senticon,
  negations,
  stemmed: true, // Indicates that tokens have been stemmed.
};
