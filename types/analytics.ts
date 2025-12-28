// Analytics TypeScript type definitions

export interface PageViewEvent {
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

export interface AnalyticsStats {
  today: PeriodStats;
  yesterday: PeriodStats;
  last_7_days: PeriodStats;
  last_30_days: PeriodStats;
}

export interface PeriodStats {
  views: number;
  unique_visitors: number;
}

export interface PageStat {
  path: string;
  views: number;
  unique_visitors: number;
}

export interface ReferrerStat {
  referrer: string;
  visits: number;
}

export interface DeviceStats {
  browsers: BrowserStat[];
  devices: DeviceStat[];
  screen_sizes: ScreenSizeStat[];
}

export interface BrowserStat {
  name: string;
  count: number;
}

export interface DeviceStat {
  type: string;
  count: number;
}

export interface ScreenSizeStat {
  resolution: string;
  count: number;
}

export interface GeographyStat {
  country: string;
  code: string;
  views: number;
}

export interface RealtimeEvent {
  path: string;
  country: string;
  timestamp: number;
}

export interface PageviewsOverTime {
  date: string;
  views: number;
  unique_visitors: number;
}

export type TimePeriod = '24h' | '7d' | '30d' | '90d';
