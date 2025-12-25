/**
 * Cloudflare Worker: Stats API
 * Provides analytics data for the dashboard
 */

interface Env {
  DB: D1Database;
  API_KEY: string;
  ALLOWED_DASHBOARD_ORIGIN: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // CORS headers
    const origin = request.headers.get('Origin') || '';
    const corsHeaders = origin === env.ALLOWED_DASHBOARD_ORIGIN
      ? {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      : {};

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only accept GET
    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    // Check API key
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const token = authHeader.substring(7);
    if (token !== env.API_KEY) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    try {
      const url = new URL(request.url);
      const path = url.pathname;

      let response;

      if (path.endsWith('/overview')) {
        response = await getOverviewStats(env.DB);
      } else if (path.endsWith('/pageviews-over-time')) {
        const period = url.searchParams.get('period') || '7d';
        response = await getPageviewsOverTime(env.DB, period);
      } else if (path.endsWith('/pages')) {
        const period = url.searchParams.get('period') || '7d';
        response = await getTopPages(env.DB, period);
      } else if (path.endsWith('/referrers')) {
        const period = url.searchParams.get('period') || '7d';
        response = await getReferrers(env.DB, period);
      } else if (path.endsWith('/devices')) {
        const period = url.searchParams.get('period') || '7d';
        response = await getDeviceStats(env.DB, period);
      } else if (path.endsWith('/geography')) {
        const period = url.searchParams.get('period') || '7d';
        response = await getGeographyStats(env.DB, period);
      } else if (path.endsWith('/realtime')) {
        response = await getRealtimeEvents(env.DB);
      } else {
        return new Response('Not found', { status: 404, headers: corsHeaders });
      }

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Stats API error:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  },
};

// Helper function to get time range
function getTimeRange(period: string): number {
  const now = Date.now();
  const ranges: Record<string, number> = {
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
    '90d': 90 * 24 * 60 * 60 * 1000,
  };
  return now - (ranges[period] || ranges['7d']);
}

async function getOverviewStats(db: D1Database) {
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const twoDaysAgo = now - 2 * 24 * 60 * 60 * 1000;
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  const [today, yesterday, last7d, last30d] = await Promise.all([
    db.prepare('SELECT COUNT(*) as views, COUNT(DISTINCT visitor_id) as unique_visitors FROM pageviews WHERE created_at >= ?').bind(oneDayAgo).first(),
    db.prepare('SELECT COUNT(*) as views, COUNT(DISTINCT visitor_id) as unique_visitors FROM pageviews WHERE created_at >= ? AND created_at < ?').bind(twoDaysAgo, oneDayAgo).first(),
    db.prepare('SELECT COUNT(*) as views, COUNT(DISTINCT visitor_id) as unique_visitors FROM pageviews WHERE created_at >= ?').bind(sevenDaysAgo).first(),
    db.prepare('SELECT COUNT(*) as views, COUNT(DISTINCT visitor_id) as unique_visitors FROM pageviews WHERE created_at >= ?').bind(thirtyDaysAgo).first(),
  ]);

  return {
    today: { views: today?.views || 0, unique_visitors: today?.unique_visitors || 0 },
    yesterday: { views: yesterday?.views || 0, unique_visitors: yesterday?.unique_visitors || 0 },
    last_7_days: { views: last7d?.views || 0, unique_visitors: last7d?.unique_visitors || 0 },
    last_30_days: { views: last30d?.views || 0, unique_visitors: last30d?.unique_visitors || 0 },
  };
}

async function getTopPages(db: D1Database, period: string) {
  const since = getTimeRange(period);

  const result = await db.prepare(`
    SELECT
      page_path as path,
      COUNT(*) as views,
      COUNT(DISTINCT visitor_id) as unique_visitors
    FROM pageviews
    WHERE created_at >= ?
    GROUP BY page_path
    ORDER BY views DESC
    LIMIT 20
  `).bind(since).all();

  return result.results || [];
}

async function getReferrers(db: D1Database, period: string) {
  const since = getTimeRange(period);

  const result = await db.prepare(`
    SELECT
      referrer,
      COUNT(*) as visits
    FROM pageviews
    WHERE created_at >= ?
    GROUP BY referrer
    ORDER BY visits DESC
    LIMIT 20
  `).bind(since).all();

  return result.results || [];
}

async function getDeviceStats(db: D1Database, period: string) {
  const since = getTimeRange(period);

  // Extract browser from user agent (simplified)
  const browsersResult = await db.prepare(`
    SELECT
      CASE
        WHEN user_agent LIKE '%Chrome%' THEN 'Chrome'
        WHEN user_agent LIKE '%Safari%' THEN 'Safari'
        WHEN user_agent LIKE '%Firefox%' THEN 'Firefox'
        WHEN user_agent LIKE '%Edge%' THEN 'Edge'
        ELSE 'Other'
      END as name,
      COUNT(*) as count
    FROM pageviews
    WHERE created_at >= ?
    GROUP BY name
    ORDER BY count DESC
  `).bind(since).all();

  // Detect device type (simplified)
  const devicesResult = await db.prepare(`
    SELECT
      CASE
        WHEN user_agent LIKE '%Mobile%' THEN 'mobile'
        WHEN user_agent LIKE '%Tablet%' THEN 'tablet'
        ELSE 'desktop'
      END as type,
      COUNT(*) as count
    FROM pageviews
    WHERE created_at >= ?
    GROUP BY type
    ORDER BY count DESC
  `).bind(since).all();

  const screenSizesResult = await db.prepare(`
    SELECT
      screen_resolution as resolution,
      COUNT(*) as count
    FROM pageviews
    WHERE created_at >= ?
    GROUP BY screen_resolution
    ORDER BY count DESC
    LIMIT 10
  `).bind(since).all();

  return {
    browsers: browsersResult.results || [],
    devices: devicesResult.results || [],
    screen_sizes: screenSizesResult.results || [],
  };
}

async function getGeographyStats(db: D1Database, period: string) {
  const since = getTimeRange(period);

  const result = await db.prepare(`
    SELECT
      country,
      country as code,
      COUNT(*) as views
    FROM pageviews
    WHERE created_at >= ?
    GROUP BY country
    ORDER BY views DESC
    LIMIT 20
  `).bind(since).all();

  return result.results || [];
}

async function getRealtimeEvents(db: D1Database) {
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

  const result = await db.prepare(`
    SELECT
      page_path as path,
      country,
      created_at as timestamp
    FROM pageviews
    WHERE created_at >= ?
    ORDER BY created_at DESC
    LIMIT 100
  `).bind(fiveMinutesAgo).all();

  return result.results || [];
}

async function getPageviewsOverTime(db: D1Database, period: string) {
  const since = getTimeRange(period);

  // Get pageviews grouped by day
  const result = await db.prepare(`
    SELECT
      strftime('%Y-%m-%d', created_at / 1000, 'unixepoch') as date,
      COUNT(*) as views,
      COUNT(DISTINCT visitor_id) as unique
    FROM pageviews
    WHERE created_at >= ?
    GROUP BY strftime('%Y-%m-%d', created_at / 1000, 'unixepoch')
    ORDER BY date ASC
  `).bind(since).all();

  return result.results || [];
}
