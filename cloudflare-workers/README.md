# Cloudflare Workers - Analytics Backend

This directory contains the serverless backend for the French by Examples analytics system.

## Structure

```
cloudflare-workers/
├── migrations/
│   └── 0001_initial_schema.sql    # Database schema
├── track-event/
│   ├── src/
│   │   └── index.ts               # Track event worker
│   ├── package.json
│   └── wrangler.toml              # Worker configuration
└── stats-api/
    ├── src/
    │   └── index.ts               # Stats API worker
    ├── package.json
    └── wrangler.toml              # Worker configuration
```

## Workers

### 1. Track Event Worker (`track-event`)

**Purpose**: Receives and stores page view events from the frontend.

**Endpoint**: `POST /api/track`

**Features**:
- CORS handling for GitHub Pages origin
- Request validation
- Geographic data enrichment (from Cloudflare)
- Bot detection (client + server side)
- D1 database storage
- Visitor deduplication

**Environment Variables**:
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins (default: `https://sunsetboy.github.io`)
- `RATE_LIMIT_PER_MINUTE`: Maximum requests per visitor per minute (default: `60`)

**Database Bindings**:
- `DB`: D1 database binding

### 2. Stats API Worker (`stats-api`)

**Purpose**: Provides aggregated analytics data for the dashboard.

**Endpoints**:
- `GET /api/stats/overview` - Summary metrics (today, 7d, 30d)
- `GET /api/stats/pages?period=7d` - Top pages
- `GET /api/stats/referrers?period=7d` - Traffic sources
- `GET /api/stats/devices?period=7d` - Device/browser stats
- `GET /api/stats/geography?period=7d` - Geographic distribution
- `GET /api/stats/realtime` - Recent events (last 5 minutes)

**Authentication**: Bearer token (API key in Authorization header)

**Environment Variables**:
- `ALLOWED_DASHBOARD_ORIGIN`: Dashboard origin (default: `https://sunsetboy.github.io`)

**Secrets**:
- `API_KEY`: Secret API key for authentication

**Database Bindings**:
- `DB`: D1 database binding

## Deployment

### Prerequisites

1. Cloudflare account
2. Wrangler CLI installed: `npm install -g wrangler`
3. Authenticated: `wrangler login`

### Initial Setup

1. **Create D1 Database**:
   ```bash
   wrangler d1 create french-by-examples-analytics
   ```

2. **Update Configuration**:
   - Copy the database ID from the output
   - Update `database_id` in both `wrangler.toml` files

3. **Run Migration**:
   ```bash
   wrangler d1 migrations create french-by-examples-analytics initial_schema
   # Copy contents from migrations/0001_initial_schema.sql
   wrangler d1 migrations apply french-by-examples-analytics
   ```

4. **Set API Key Secret**:
   ```bash
   cd stats-api
   wrangler secret put API_KEY
   ```

### Deploy Workers

**Track Event Worker**:
```bash
cd track-event
npm install
wrangler deploy
```

**Stats API Worker**:
```bash
cd stats-api
npm install
wrangler deploy
```

### Update After Changes

After modifying worker code:
```bash
cd track-event  # or stats-api
wrangler deploy
```

## Local Development

Run workers locally:

**Track Event**:
```bash
cd track-event
wrangler dev
```

**Stats API**:
```bash
cd stats-api
wrangler dev --local
```

Note: Local development requires `.dev.vars` file with environment variables.

## Monitoring

### View Live Logs

```bash
cd track-event  # or stats-api
wrangler tail
```

### Query Database

```bash
wrangler d1 execute french-by-examples-analytics --command "SELECT COUNT(*) FROM pageviews"
```

### Export Data

```bash
wrangler d1 export french-by-examples-analytics --output backup.sql
```

## Database Schema

### Tables

1. **pageviews**: Raw page view events
   - Columns: visitor_id, session_id, page_path, country, user_agent, etc.
   - Indexes: created_at, visitor_id, page_path, country

2. **visitors**: Unique visitor tracking
   - Columns: visitor_id (PK), first_seen, last_seen, total_visits, countries
   - Indexes: first_seen, last_seen

3. **daily_stats**: Pre-aggregated statistics (for future optimization)
   - Columns: date, metric_type, metric_value, pageviews, unique_visitors
   - Indexes: date, metric_type

## Free Tier Limits

**Cloudflare Workers**:
- 100,000 requests/day
- 10ms CPU time per request

**D1 Database**:
- 5GB storage
- 5M rows read/day
- 100K rows written/day

With 500 pageviews/day, you'll use:
- ~0.5% of request limit
- ~0.5% of write limit
- <1% of storage (with 90-day retention)

## Troubleshooting

**CORS Errors**:
- Verify `ALLOWED_ORIGINS` matches your GitHub Pages URL exactly
- Check browser console for specific error messages

**Database Errors**:
- Confirm database ID is correct in wrangler.toml
- Verify migration was applied: `wrangler d1 migrations list`

**Authentication Errors**:
- Ensure API_KEY secret is set: `wrangler secret list`
- Verify API key matches in frontend .env.local

## Security Notes

- Never commit `.dev.vars` or expose API keys
- Rotate API key periodically
- Monitor usage in Cloudflare dashboard
- Use Cloudflare's built-in DDoS protection
- Consider adding rate limiting with Durable Objects for production

## Cost Optimization

- Pre-aggregate data in `daily_stats` table for large datasets
- Delete old raw pageviews after 90 days
- Cache dashboard queries with Cloudflare Cache API
- Use Cloudflare Analytics for Worker performance monitoring (free)

## Support

For issues:
1. Check worker logs: `wrangler tail`
2. Verify D1 connection: `wrangler d1 execute`
3. Review Cloudflare Workers documentation: https://developers.cloudflare.com/workers/

## Roadmap

Future enhancements:
- [ ] Cron worker for daily aggregation
- [ ] Advanced bot detection with ML
- [ ] Session duration tracking
- [ ] Event tracking (button clicks, test completions)
- [ ] A/B testing support
- [ ] Data export API
- [ ] Alerting for traffic anomalies
