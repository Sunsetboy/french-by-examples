# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

French by Examples is a Next.js 16 application for learning French connectors and expressions through practical examples. The site is:
- Statically exported to GitHub Pages
- Content-driven using YAML files (in `data/`)
- Includes a custom analytics system using Cloudflare Workers + D1 database
- Generates a static JSON API during build for potential mobile apps

## Common Commands

### Development
```bash
npm run dev                 # Start Next.js dev server on localhost:3000
npm run lint                # Run ESLint
npm run build               # Build production site (includes API generation)
npm run generate:api        # Generate JSON API files only
```

### Cloudflare Workers (Analytics Backend)

Navigate to worker directory first: `cd cloudflare-workers/track-event` or `cd cloudflare-workers/stats-api`

```bash
wrangler dev                # Run worker locally
wrangler deploy             # Deploy to Cloudflare
wrangler tail               # View live logs
wrangler d1 execute french-by-examples-analytics --command "SQL"  # Run SQL query
```

## Architecture

### Static Content System

**Data Layer**: YAML files in `data/connectors/` and `data/tests/` define all content
- Connectors: French connecting words with examples, CEFR levels, formality indicators
- Tests: Interactive quizzes with multiple choice questions

**Build Process**:
1. `scripts/generate-json-api.ts` reads YAML files via `lib/data.ts`
2. Generates static JSON files in `public/api/` (connectors.json, tests.json, individual files)
3. Next.js builds static pages using these files

**Key Type Definitions**:
- `types/connector.ts`: Connector data structure (term, translation, type, CEFR level, examples, etc.)
- `types/test.ts`: Test question structure
- `types/analytics.ts`: Analytics event types

### Next.js App Router Structure

```
app/
├── connectors/[id]/page.tsx    # Dynamic connector detail pages
├── connectors/page.tsx         # Connector listing page
├── tests/[id]/page.tsx         # Dynamic test pages
├── tests/page.tsx              # Test listing page
├── analytics/                  # Analytics dashboard (password protected)
├── layout.tsx                  # Root layout with theme provider
└── page.tsx                    # Homepage
```

All pages are statically generated at build time using Next.js static export (`output: 'export'` in `next.config.ts`).

### Analytics System

A privacy-first, cookieless analytics system using Cloudflare's edge network.

**Frontend** (`components/analytics-tracker.tsx`):
- Browser fingerprinting for visitor identification (no cookies)
- Tracks page views with device/browser/location metadata
- Sends events to Cloudflare Worker via POST

**Backend** (2 Cloudflare Workers in `cloudflare-workers/`):
1. **track-event**: Receives page view events, validates, enriches with geo data, stores in D1
2. **stats-api**: Provides aggregated analytics data (requires API key authentication)

**Database**: Cloudflare D1 (SQLite) with schema in `cloudflare-workers/migrations/`
- `pageviews`: Raw events
- `visitors`: Unique visitor tracking
- `daily_stats`: Pre-aggregated data (future optimization)

**Analytics Components** (`components/analytics/`):
- Dashboard widgets for overview, charts, tables
- Real-time feed, geography map, device breakdown
- All consume data from stats-api worker

### GitHub Pages Deployment

Configured in `next.config.ts`:
- `basePath: '/french-by-examples'` for repository-based GitHub Pages
- `assetPrefix: '/french-by-examples'` for asset paths
- `output: 'export'` for static site generation

GitHub Actions (`.github/workflows/deploy.yml`) automatically builds and deploys on push to master.

## Data File Formats

### Connector YAML Structure
```yaml
term: "connector term"
translation: "English translation"
type:
  - consequence    # Available types: cause, consequence, opposition,
  - conclusion     # addition, time, conclusion, example, emphasis,
                   # condition, comparison
cefrLevel: "B1"    # A1, A2, B1, B2, C1, C2
formality: "neutral"  # informal, neutral, formal
description: "Brief description"
usage: "Detailed usage explanation"
examples:
  - french: "French sentence"
    english: "English translation"
    context: "Optional context"
synonyms:
  - "synonym 1"
notes: "Optional notes"
```

### Test YAML Structure
```yaml
title: "Test Title"
description: "Test description"
cefrLevel: "B1"
types:
  - consequence
questions:
  - id: "q1"
    sentence: "French sentence with ___"
    correctAnswer: "correct answer"
    options:
      - "option1"
      - "option2"
    explanation: "Why this is correct"
    translation: "English translation"
```

## Environment Configuration

Copy `.env.local.example` to `.env.local` and configure:
- `NEXT_PUBLIC_ANALYTICS_ENDPOINT`: Track event worker URL
- `NEXT_PUBLIC_STATS_API_ENDPOINT`: Stats API worker URL
- `NEXT_PUBLIC_ANALYTICS_ENABLED`: Enable/disable tracking
- `NEXT_PUBLIC_ANALYTICS_API_KEY`: API key for stats API (must match Cloudflare Worker secret)
- `NEXT_PUBLIC_ANALYTICS_PASSWORD`: Password for analytics dashboard

## Key Patterns

### Adding New Connectors
1. Create `data/connectors/term-name.yaml` following the template
2. File name becomes the connector ID (used in URLs)
3. Build process auto-generates pages and API endpoints

### Adding New Tests
1. Create `data/tests/test-name.yaml` following the template
2. Include 5-10 questions per test
3. Use plausible but incorrect distractors

### Working with Analytics
- Frontend tracking is automatic via `components/analytics-tracker.tsx` in root layout
- Stats API requires authentication (Bearer token in Authorization header)
- All stats endpoints support `?period=7d|30d` query parameter
- Dashboard at `/analytics` requires password from env var

### Styling
- Tailwind CSS 4 with dark mode support via `next-themes`
- Theme toggle component in header
- All components support light/dark themes

## Important Implementation Details

### Static Export Constraints
- No server-side rendering or API routes (Next.js API routes don't work)
- All data must be available at build time
- Images must use `unoptimized: true` in next.config.ts
- External APIs (analytics) called from client-side only

### YAML Data Loading
The `lib/data.ts` module provides server-side functions for loading YAML:
- `getAllConnectors()`: Load all connectors
- `getConnectorById(id)`: Load single connector
- `getAllTests()`: Load all tests
- These only work during build (use static JSON API at runtime)

### Cloudflare Workers Development
- Workers run on Cloudflare's edge network
- Local development uses `wrangler dev`
- D1 database is SQLite, accessed via bindings in worker context
- Free tier limits: 100k requests/day, 5GB storage, 100k writes/day
- See `cloudflare-workers/README.md` for detailed deployment instructions

### basePath Configuration
The site uses `/french-by-examples` as basePath for GitHub Pages. If deploying to a custom domain:
1. Remove `basePath` and `assetPrefix` from `next.config.ts`
2. Update `baseUrl` in `app/sitemap.ts` and `app/robots.ts`
