/**
 * Cloudflare Worker: Track Event API
 * Receives page view events and stores them in D1 database
 */

interface Env {
  DB: D1Database;
  ALLOWED_ORIGINS: string;
  RATE_LIMIT_PER_MINUTE: string;
}

interface PageViewEvent {
  visitor_id: string;
  session_id: string;
  page_path: string;
  page_title: string;
  referrer: string;
  user_agent: string;
  screen_resolution: string;
  viewport_size: string;
  language: string;
  timestamp: number;
  is_bot: boolean;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // CORS headers
    const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
    const origin = request.headers.get('Origin') || '';
    const corsHeaders = allowedOrigins.includes(origin)
      ? {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      : {};

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only accept POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      // Parse request body
      const event: PageViewEvent = await request.json();

      // Validate required fields
      if (!event.visitor_id || !event.page_path || !event.timestamp) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate timestamp (must be within ±5 minutes)
      const now = Date.now();
      const timeDiff = Math.abs(now - event.timestamp);
      if (timeDiff > 5 * 60 * 1000) {
        return new Response(
          JSON.stringify({ error: 'Invalid timestamp' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Rate limiting check (basic implementation using visitor_id)
      // In production, use Durable Objects or KV for distributed rate limiting
      const rateLimit = parseInt(env.RATE_LIMIT_PER_MINUTE || '60', 10);
      // TODO: Implement rate limiting with KV

      // Get geographic data from Cloudflare
      const cf = request.cf;
      const country = cf?.country as string || 'Unknown';
      const region = cf?.region as string || '';
      const city = cf?.city as string || '';
      const timezone = cf?.timezone as string || '';

      // Detect bot from user agent (server-side detection)
      const userAgent = event.user_agent.toLowerCase();
      const isServerBot = /bot|crawl|spider|slurp|headless/i.test(userAgent);
      const finalIsBot = event.is_bot || isServerBot;

      // Insert into database
      const result = await env.DB.prepare(`
        INSERT INTO pageviews (
          visitor_id, session_id, page_path, page_title,
          referrer, user_agent, screen_resolution, viewport_size,
          language, country, region, city, timezone,
          is_bot, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        event.visitor_id,
        event.session_id,
        event.page_path,
        event.page_title,
        event.referrer,
        event.user_agent,
        event.screen_resolution,
        viewport_size,
        event.language,
        country,
        region,
        city,
        timezone,
        finalIsBot ? 1 : 0,
        event.timestamp
      ).run();

      // Update visitors table
      await env.DB.prepare(`
        INSERT INTO visitors (visitor_id, first_seen, last_seen, total_visits, countries)
        VALUES (?, ?, ?, 1, ?)
        ON CONFLICT(visitor_id) DO UPDATE SET
          last_seen = excluded.last_seen,
          total_visits = total_visits + 1,
          countries = CASE
            WHEN instr(countries, excluded.countries) = 0
            THEN countries || ',' || excluded.countries
            ELSE countries
          END
      `).bind(
        event.visitor_id,
        event.timestamp,
        event.timestamp,
        country
      ).run();

      return new Response(
        JSON.stringify({ success: true, id: result.meta.last_row_id }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Track event error:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  },
};
