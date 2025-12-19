# Analytics Setup Guide

Complete guide to setting up and deploying the custom serverless analytics system for French by Examples.

## Overview

The analytics system consists of:
- **Frontend**: Tracking component integrated into Next.js app (already deployed on GitHub Pages)
- **Backend**: Two Cloudflare Workers (track-event and stats-api) + D1 database
- **Dashboard**: Built into the app at `/analytics` route

## Prerequisites

1. A Cloudflare account (free tier is sufficient)
2. Node.js 18+ installed
3. Basic familiarity with command line

## Step 1: Install Wrangler CLI

Wrangler is Cloudflare's CLI tool for managing Workers.

```bash
npm install -g wrangler
```

Verify installation:
```bash
wrangler --version
```

## Step 2: Authenticate with Cloudflare

```bash
wrangler login
```

This will open a browser window to authenticate with your Cloudflare account.

## Step 3: Create D1 Database

From the project root:

```bash
cd cloudflare-workers
wrangler d1 create french-by-examples-analytics
```

**Important**: Save the database ID that's printed. You'll need it in the next step.

Example output:
```
Created database french-by-examples-analytics
Database ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

## Step 4: Update Worker Configurations

Edit both `wrangler.toml` files and replace `YOUR_DATABASE_ID_HERE` with the actual database ID from Step 3:

1. `cloudflare-workers/track-event/wrangler.toml`
2. `cloudflare-workers/stats-api/wrangler.toml`

Replace:
```toml
database_id = "YOUR_DATABASE_ID_HERE"
```

With:
```toml
database_id = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"  # Your actual ID
```

## Step 5: Run Database Migration

Apply the database schema:

```bash
wrangler d1 migrations create french-by-examples-analytics initial_schema
```

This creates a migration file. Copy the contents of `migrations/0001_initial_schema.sql` into the created migration file, then apply it:

```bash
wrangler d1 migrations apply french-by-examples-analytics
```

Confirm when prompted. This creates the tables and indexes.

## Step 6: Set API Key Secret

Generate a secure API key:

```bash
openssl rand -hex 32
```

This outputs a random string like: `a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456`

Set it as a secret for the stats-api worker:

```bash
cd cloudflare-workers/stats-api
wrangler secret put API_KEY
```

When prompted, paste the generated API key. This key will be used to authenticate dashboard requests.

## Step 7: Deploy Workers

### Deploy Track Event Worker

```bash
cd cloudflare-workers/track-event
npm install
wrangler deploy
```

Save the deployment URL (e.g., `https://french-by-examples-track.your-subdomain.workers.dev`)

### Deploy Stats API Worker

```bash
cd ../stats-api
npm install
wrangler deploy
```

Save the deployment URL (e.g., `https://french-by-examples-stats.your-subdomain.workers.dev`)

## Step 8: Update Frontend Environment Variables

Create or update `.env.local` in the project root:

```bash
# Analytics tracking endpoint
NEXT_PUBLIC_ANALYTICS_ENDPOINT=https://french-by-examples-track.your-subdomain.workers.dev/api/track

# Stats API endpoint
NEXT_PUBLIC_STATS_API_ENDPOINT=https://french-by-examples-stats.your-subdomain.workers.dev/api/stats

# Enable analytics (set to false for local development)
NEXT_PUBLIC_ANALYTICS_ENABLED=true

# Stats API key (same key you set in Step 6)
NEXT_PUBLIC_ANALYTICS_API_KEY=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456

# Dashboard password (change this!)
NEXT_PUBLIC_ANALYTICS_PASSWORD=your-secure-password-here
```

**Important**: For production deployment, add these environment variables to your GitHub repository secrets:

1. Go to your repository on GitHub
2. Settings → Secrets and variables → Actions
3. Add the environment variables as repository secrets

Then update `.github/workflows/deploy.yml` to inject them during build:

```yaml
- name: Build with Next.js
  env:
    NEXT_PUBLIC_ANALYTICS_ENDPOINT: ${{ secrets.NEXT_PUBLIC_ANALYTICS_ENDPOINT }}
    NEXT_PUBLIC_STATS_API_ENDPOINT: ${{ secrets.NEXT_PUBLIC_STATS_API_ENDPOINT }}
    NEXT_PUBLIC_ANALYTICS_ENABLED: ${{ secrets.NEXT_PUBLIC_ANALYTICS_ENABLED }}
    NEXT_PUBLIC_ANALYTICS_API_KEY: ${{ secrets.NEXT_PUBLIC_ANALYTICS_API_KEY }}
    NEXT_PUBLIC_ANALYTICS_PASSWORD: ${{ secrets.NEXT_PUBLIC_ANALYTICS_PASSWORD }}
  run: npm run build
```

## Step 9: Test Locally

Build and test the app locally:

```bash
npm run build
npm run dev
```

Visit `http://localhost:3000` and navigate between pages. Check:
1. Browser Network tab shows POST requests to the track endpoint
2. No JavaScript errors in console
3. D1 database receives data (check in Cloudflare dashboard)

## Step 10: Deploy to Production

Commit and push your changes:

```bash
git add .
git commit -m "Add analytics system"
git push origin master
```

GitHub Actions will automatically build and deploy to GitHub Pages.

## Step 11: Access the Dashboard

Visit: `https://sunsetboy.github.io/french-by-examples/analytics`

Enter the password you set in `NEXT_PUBLIC_ANALYTICS_PASSWORD`.

## Verification Checklist

- [ ] D1 database created and migrated
- [ ] Both workers deployed successfully
- [ ] Environment variables configured
- [ ] Tracking works (check Network tab)
- [ ] Data appears in D1 database
- [ ] Dashboard loads and shows data
- [ ] No cookies are set (verify in DevTools → Application → Cookies)

## Troubleshooting

### Issue: "Analytics API not configured" error in dashboard

**Solution**: Ensure environment variables are set correctly in `.env.local` and GitHub secrets.

### Issue: CORS errors in browser console

**Solution**: Verify `ALLOWED_ORIGINS` in worker configurations matches your GitHub Pages URL exactly (including https://).

### Issue: No data in dashboard

**Solution**:
1. Check that `NEXT_PUBLIC_ANALYTICS_ENABLED=true`
2. Verify Worker deployment URLs are correct
3. Check D1 database has data: `wrangler d1 execute french-by-examples-analytics --command "SELECT COUNT(*) FROM pageviews"`

### Issue: Rate limiting too aggressive

**Solution**: Increase `RATE_LIMIT_PER_MINUTE` in `cloudflare-workers/track-event/wrangler.toml` and redeploy.

## Monitoring and Maintenance

### View Worker Logs

```bash
cd cloudflare-workers/track-event
wrangler tail
```

### Check D1 Database

```bash
wrangler d1 execute french-by-examples-analytics --command "SELECT COUNT(*) FROM pageviews"
```

### Export Data

```bash
wrangler d1 export french-by-examples-analytics --output backup.sql
```

### Monitor Costs

Visit Cloudflare Dashboard → Workers & Pages → Usage

Free tier limits:
- Workers: 100,000 requests/day
- D1: 5GB storage, 5M reads/day, 100K writes/day

## Optional: Daily Aggregation (Future Enhancement)

For better performance with large datasets, implement a cron worker to aggregate daily stats:

1. Create `cloudflare-workers/aggregate-daily/src/index.ts`
2. Add cron trigger in wrangler.toml
3. Implement aggregation logic to populate `daily_stats` table

This is optional and only needed if you exceed thousands of pageviews per day.

## Security Best Practices

1. **Never commit secrets**: Keep API keys in Cloudflare secrets and GitHub repository secrets
2. **Rotate API key periodically**: Generate new key and update both workers and frontend
3. **Use strong dashboard password**: Change default password immediately
4. **Monitor usage**: Set up Cloudflare email alerts for unusual traffic patterns
5. **Keep workers updated**: Regularly update Wrangler and @cloudflare/workers-types

## Support

If you encounter issues:

1. Check Cloudflare Workers logs: `wrangler tail`
2. Verify D1 database connection: `wrangler d1 execute`
3. Review browser console for frontend errors
4. Ensure all URLs use HTTPS (not HTTP)

## Cost Estimate

With typical traffic (500 pageviews/day):

- **Cloudflare Workers**: $0 (within free tier)
- **D1 Database**: $0 (within free tier)
- **GitHub Pages**: $0 (free for public repositories)

**Total**: $0/month

The system can handle up to ~3,000 pageviews/day on the free tier before needing upgrades.
