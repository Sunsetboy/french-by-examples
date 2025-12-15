# French by Examples

Learn French connectors and expressions through practical examples. Make your French more fluent and natural.

## 🎯 Features

- **Practical Examples**: Learn from real-world usage with detailed examples in context
- **CEFR Levels**: Every connector is tagged with its CEFR level (A1-C2)
- **Formality Levels**: Know when to use each expression (informal, neutral, formal)
- **Interactive Tests**: Practice what you learn with interactive quizzes
- **Dark Mode**: Comfortable learning experience with light/dark theme support
- **Mobile Friendly**: Responsive design for desktop and mobile devices
- **SEO Optimized**: Easily discoverable by search engines
- **Privacy First**: No cookies, no tracking, no user data collection
- **Open Source**: Community-driven content that anyone can contribute to

## 🚀 Live Demo

Visit [https://sunsetboy.github.io/french-by-examples](https://sunsetboy.github.io/french-by-examples)

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Format**: YAML files for easy contribution
- **Deployment**: GitHub Pages with GitHub Actions
- **API**: Static JSON API for future mobile app

## 📁 Project Structure

```
french-by-examples/
├── app/                    # Next.js app directory
│   ├── connectors/        # Connector pages
│   ├── tests/             # Test/quiz pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── connector-card.tsx
│   ├── navigation.tsx
│   └── theme-provider.tsx
├── data/                  # Content data (YAML files)
│   ├── connectors/        # Individual connector files
│   └── tests/             # Test definition files
├── lib/                   # Utility functions
│   ├── data.ts           # Data loading functions
│   └── utils.ts          # Helper utilities
├── types/                 # TypeScript type definitions
│   ├── connector.ts
│   └── test.ts
├── public/                # Static assets
│   └── api/              # Generated JSON API files
└── scripts/               # Build scripts
    └── generate-json-api.ts
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Adding a New Connector

1. Fork the repository
2. Create a new YAML file in `data/connectors/` (e.g., `your-connector.yaml`)
3. Follow this template:

```yaml
term: "your connector"
translation: "English translation"
type:
  - cause        # cause, consequence, opposition, addition, time,
                 # conclusion, example, emphasis, condition, comparison
cefrLevel: "B1"  # A1, A2, B1, B2, C1, or C2
formality: "neutral"  # informal, neutral, or formal
description: "Brief description of the connector and its usage."
usage: "Detailed explanation of how and when to use this connector."
examples:
  - french: "Example sentence in French."
    english: "Example sentence in English."
    context: "Optional context or situation where this is used"
  - french: "Another example."
    english: "Another example translation."
synonyms:
  - "synonym 1"
  - "synonym 2"
notes: "Optional: any important notes or warnings about usage."
```

4. Test locally: `npm run dev`
5. Create a Pull Request with a clear description

### Adding a New Test

1. Create a new YAML file in `data/tests/` (e.g., `your-test.yaml`)
2. Follow this template:

```yaml
title: "Test Title"
description: "Brief description of what this test covers."
cefrLevel: "B1"
types:
  - consequence
  - cause
questions:
  - id: "q1"
    sentence: "French sentence with ___ for the blank."
    correctAnswer: "donc"
    options:
      - "donc"
      - "en fait"
      - "du coup"
      - "par ailleurs"
    explanation: "Why this answer is correct."
    translation: "English translation of the sentence."
```

3. Test locally and create a Pull Request

### Contribution Guidelines

- **Quality over Quantity**: Ensure examples are natural and authentic
- **Accuracy**: Double-check translations and usage contexts
- **Clear Examples**: Provide context that helps learners understand when to use the connector
- **Follow the Format**: Stick to the YAML structure for consistency
- **One Connector per PR**: Makes review easier and faster
- **Test Your Changes**: Run `npm run dev` and verify your additions work correctly

## 🏃‍♂️ Local Development

### Prerequisites

- Node.js 20 or higher
- npm

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Sunsetboy/french-by-examples.git
cd french-by-examples
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
```

This will:
1. Generate JSON API files in `public/api/`
2. Build the Next.js static site in `out/`

## 📱 Future Mobile App

The application generates a static JSON API during build that can be consumed by mobile apps:

- `public/api/connectors.json` - List of all connectors
- `public/api/connectors/[id].json` - Individual connector details
- `public/api/tests.json` - List of all tests
- `public/api/tests/[id].json` - Individual test details
- `public/api/metadata.json` - General metadata

## 🔧 Configuration

### Updating the Site URL

Update the base URL in these files:
- `app/sitemap.ts` - Update `baseUrl`
- `app/robots.ts` - Update `baseUrl`
- `components/navigation.tsx` - Update GitHub link

### GitHub Pages Deployment

If deploying to `username.github.io/repo-name` (not a custom domain):

1. Uncomment these lines in `next.config.ts`:
```typescript
basePath: '/french-by-examples',
assetPrefix: '/french-by-examples',
```

2. Enable GitHub Pages in your repository settings:
   - Settings → Pages → Source: GitHub Actions

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

Inspired by [Go by Example](https://gobyexample.com/) - learning by practical examples.

## 📬 Contact

Questions or suggestions? [Open an issue](https://github.com/Sunsetboy/french-by-examples/issues)

---

Made with ❤️ for French learners worldwide
