# Contributing to French by Examples

Thank you for your interest in contributing to French by Examples! This document provides guidelines and instructions for contributing.

## How to Contribute

### Adding a New Connector

Connectors are the heart of this project. Here's how to add a new one:

1. **Fork and Clone**
   ```bash
   git fork https://github.com/Sunsetboy/french-by-examples
   git clone https://github.com/Sunsetboy/french-by-examples
   cd french-by-examples
   ```

2. **Create a New Connector File**

   Create a new YAML file in `data/connectors/` using the connector term as the filename (lowercase, hyphenated). For example: `en-plus.yaml`, `par-consequent.yaml`

3. **Follow the Template**

```yaml
term: "connector term"
translation: "English translation"
type:
  - cause           # Choose from: cause, consequence, opposition, addition,
  - consequence     # time, conclusion, example, emphasis, condition, comparison
cefrLevel: "B1"     # A1, A2, B1, B2, C1, or C2
formality: "neutral" # informal, neutral, or formal
description: "Clear, concise description of what this connector means and when it's used."
usage: "Detailed explanation of grammatical usage, positioning in sentences, and common contexts."
examples:
  - french: "Complete sentence using the connector in French."
    english: "English translation of the example."
    context: "Brief note about when/why you'd use this (optional)"
  - french: "Second example showing different usage."
    english: "English translation."
    context: "Different context (optional)"
  - french: "Third example for comprehensive coverage."
    english: "English translation."
synonyms:
  - "alternative connector 1"
  - "alternative connector 2"
notes: "Important notes, warnings, or cultural context about usage (optional)."
```

4. **Quality Guidelines**

   - **Accuracy**: Ensure translations and usage notes are correct
   - **Natural Examples**: Use authentic, natural-sounding French
   - **Context**: Provide clear context that helps learners understand when to use the connector
   - **CEFR Level**: Be honest about the difficulty level
   - **Formality**: Accurately indicate the formality level
   - **Multiple Examples**: Include at least 3 examples showing different uses

5. **Test Locally**
   ```bash
   npm install
   npm run dev
   ```
   Navigate to http://localhost:3000/connectors/your-connector-id to verify

6. **Submit a Pull Request**
   - Create a new branch: `git checkout -b add-connector-en-plus`
   - Commit your changes: `git commit -m "Add connector: en plus"`
   - Push to your fork: `git push origin add-connector-en-plus`
   - Open a Pull Request with a clear description

### Adding a New Test

Tests help learners practice what they've learned.

1. **Create a Test File**

   Create a new YAML file in `data/tests/` with a descriptive name: `advanced-cause-effect.yaml`

2. **Follow the Template**

```yaml
title: "Test Title (Be Descriptive)"
description: "Brief description of what this test covers and what level it's appropriate for."
cefrLevel: "B1"  # Match to the connector levels being tested
types:
  - consequence
  - cause
questions:
  - id: "q1"  # Unique ID (q1, q2, q3, etc.)
    sentence: "French sentence with ___ indicating where the connector goes."
    correctAnswer: "donc"
    options:
      - "donc"
      - "en fait"
      - "du coup"
      - "par ailleurs"
    explanation: "Clear explanation of why this answer is correct and why others are wrong."
    translation: "English translation of the complete sentence with the correct answer."

  - id: "q2"
    sentence: "Another French sentence with ___."
    correctAnswer: "correct connector"
    options:
      - "correct connector"
      - "plausible wrong answer 1"
      - "plausible wrong answer 2"
      - "plausible wrong answer 3"
    explanation: "Explanation for this question."
    translation: "English translation."
```

3. **Test Guidelines**

   - **5-10 Questions**: Aim for this range per test
   - **Progressive Difficulty**: Order questions from easier to harder
   - **Plausible Distractors**: Wrong answers should be plausible but clearly incorrect
   - **Clear Explanations**: Help learners understand why they got it wrong
   - **Varied Contexts**: Use different sentence structures and contexts

4. **Test and Submit**
   Same process as connectors - test locally and submit a PR

### Improving Existing Content

Found a mistake or have a better example? Great!

1. **Small Fixes**: Feel free to fix typos, improve translations, or clarify descriptions
2. **Major Changes**: Open an issue first to discuss significant changes
3. **Maintain Consistency**: Keep the same format and style as existing content

## Contribution Standards

### Code of Conduct

- Be respectful and constructive
- Focus on helping learners
- Give credit where credit is due
- No plagiarism - create original examples

### Content Standards

- **Accuracy First**: All content must be linguistically accurate
- **Learner-Focused**: Always think about what helps learners most
- **Cultural Sensitivity**: Be mindful of cultural context
- **No Offensive Content**: Keep all examples appropriate for all ages

### Review Process

1. **Automated Checks**: Build must pass (checks YAML syntax)
2. **Content Review**: Maintainers will review for accuracy and quality
3. **Feedback**: We may ask for changes or clarifications
4. **Merge**: Once approved, your contribution will be merged and deployed

## Development Setup

### Prerequisites

- Node.js 20 or higher
- npm
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/Sunsetboy/french-by-examples
cd french-by-examples

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Generate JSON API files
npm run generate:api
```

### Project Structure

```
data/
├── connectors/     # Connector YAML files
└── tests/          # Test YAML files

app/
├── connectors/     # Connector pages
├── tests/          # Test pages
├── layout.tsx      # Root layout
└── page.tsx        # Homepage

components/         # Reusable React components
lib/               # Utility functions
types/             # TypeScript types
```

## Questions?

- **General Questions**: Open a [Discussion](https://github.com/Sunsetboy/french-by-examples/discussions)
- **Bug Reports**: Open an [Issue](https://github.com/Sunsetboy/french-by-examples/issues)
- **Feature Requests**: Open an [Issue](https://github.com/Sunsetboy/french-by-examples/issues) with the "enhancement" label

## Recognition

All contributors will be recognized in the project. Thank you for helping make French learning more accessible!

---

Happy Contributing! 🎉
