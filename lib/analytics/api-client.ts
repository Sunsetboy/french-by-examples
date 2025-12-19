// Analytics API client for fetching stats from Cloudflare Workers

import type {
  AnalyticsStats,
  PageStat,
  ReferrerStat,
  DeviceStats,
  GeographyStat,
  RealtimeEvent,
  TimePeriod,
} from '@/types/analytics';

const STATS_API_ENDPOINT = process.env.NEXT_PUBLIC_STATS_API_ENDPOINT;
const API_KEY = process.env.NEXT_PUBLIC_ANALYTICS_API_KEY;

/**
 * Base fetch function with authentication
 */
async function fetchStats<T>(endpoint: string): Promise<T> {
  if (!STATS_API_ENDPOINT || !API_KEY) {
    throw new Error('Analytics API not configured');
  }

  const response = await fetch(`${STATS_API_ENDPOINT}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
    },
    cache: 'no-store', // Always fetch fresh data
  });

  if (!response.ok) {
    throw new Error(`Analytics API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get overview stats (today, yesterday, 7d, 30d)
 */
export async function getOverviewStats(): Promise<AnalyticsStats> {
  return fetchStats<AnalyticsStats>('/overview');
}

/**
 * Get top pages by views for a given period
 */
export async function getTopPages(period: TimePeriod = '7d'): Promise<PageStat[]> {
  return fetchStats<PageStat[]>(`/pages?period=${period}`);
}

/**
 * Get referrer sources for a given period
 */
export async function getReferrers(period: TimePeriod = '7d'): Promise<ReferrerStat[]> {
  return fetchStats<ReferrerStat[]>(`/referrers?period=${period}`);
}

/**
 * Get device and browser breakdown for a given period
 */
export async function getDeviceStats(period: TimePeriod = '7d'): Promise<DeviceStats> {
  return fetchStats<DeviceStats>(`/devices?period=${period}`);
}

/**
 * Get geographic distribution for a given period
 */
export async function getGeographyStats(period: TimePeriod = '7d'): Promise<GeographyStat[]> {
  return fetchStats<GeographyStat[]>(`/geography?period=${period}`);
}

/**
 * Get realtime events (last 100 in 5 min window)
 */
export async function getRealtimeEvents(): Promise<RealtimeEvent[]> {
  return fetchStats<RealtimeEvent[]>('/realtime');
}
