# fast-tokenizer

A high-performance TypeScript library for tokenizing text and performing natural language processing tasks—including sentiment analysis—across multiple languages.

## Features

- ✨ **Fast & Efficient** - Optimized for performance  
- 🎯 **Type-Safe** - Written in TypeScript with full type definitions  
- 🔧 **Zero Dependencies** - No external runtime dependencies  
- 🛡️ **Robust** - Comprehensive error handling and edge case coverage  
- 📦 **Lightweight** - Small bundle size  
- 🌐 **Multi-Language** - Support for English, Spanish, and Brazilian Portuguese (with room for more)

## Installation

Install via npm:

```bash
npm install @the-horizon-dev/fast-tokenizer
```

## Usage

### Tokenization

The core tokenizer supports multiple options including case normalization, diacritic removal, and stop word filtering. For example:

```typescript
import { Tokenizer } from "@the-horizon-dev/fast-tokenizer";

// Create an instance with default options.
const tokenizer = new Tokenizer({ lowercase: true, removeStopWords: true });
const text = "Hello, world! This is a sample text.";
const tokens = tokenizer.tokenize(text, { minLength: 3 });
console.log(tokens);

// Join tokens back to a string.
const joined = tokenizer.join(tokens);
console.log(joined);
```

### Sentiment Analysis

You can perform sentiment analysis on text using the language‑specific modules. The library provides a unified API that leverages language‑dependent dictionaries, negation rules, and (optional) stemming.

#### Example (English):

```typescript
import { SentimentAnalyzer } from "@the-horizon-dev/fast-tokenizer";

// Analyze sentiment for English text.
const analyzer = new SentimentAnalyzer();
const result = analyzer.analyze("I absolutely love this product!");
console.log(result);
// {
//   score: 3,
//   comparative: 0.3,
//   tokens: [...],
//   words: [...],
//   positive: [...],
//   negative: [...]
// }
```

#### Example (Brazilian Portuguese):

```typescript
import { SentimentAnalyzer } from "@the-horizon-dev/fast-tokenizer";

// Analyze sentiment for Portuguese text.
const analyzer = new SentimentAnalyzer();
const result = analyzer.analyze("Eu não gosto deste lugar", "pt");
console.log(result);
```

## Contributing

Feel free to fork the repository and contribute by opening pull requests or issues.

## License

MIT
