-- Initial database schema for French by Examples Analytics
-- Cloudflare D1 (SQLite) database

-- Table: pageviews
-- Stores raw page view events
CREATE TABLE IF NOT EXISTS pageviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  screen_resolution TEXT,
  viewport_size TEXT,
  language TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  timezone TEXT,
  is_bot INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL
);

-- Indexes for common queries on pageviews
CREATE INDEX IF NOT EXISTS idx_pageviews_created_at ON pageviews(created_at);
CREATE INDEX IF NOT EXISTS idx_pageviews_visitor_id ON pageviews(visitor_id);
CREATE INDEX IF NOT EXISTS idx_pageviews_page_path ON pageviews(page_path);
CREATE INDEX IF NOT EXISTS idx_pageviews_country ON pageviews(country);
CREATE INDEX IF NOT EXISTS idx_pageviews_session_id ON pageviews(session_id);

-- Table: visitors
-- Stores unique visitor information for deduplication
CREATE TABLE IF NOT EXISTS visitors (
  visitor_id TEXT PRIMARY KEY,
  first_seen INTEGER NOT NULL,
  last_seen INTEGER NOT NULL,
  total_visits INTEGER DEFAULT 1,
  countries TEXT
);

-- Index for visitor queries
CREATE INDEX IF NOT EXISTS idx_visitors_first_seen ON visitors(first_seen);
CREATE INDEX IF NOT EXISTS idx_visitors_last_seen ON visitors(last_seen);

-- Table: daily_stats
-- Pre-aggregated statistics for fast dashboard queries
CREATE TABLE IF NOT EXISTS daily_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  metric_type TEXT NOT NULL,
  metric_value TEXT NOT NULL,
  pageviews INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  UNIQUE(date, metric_type, metric_value)
);

-- Indexes for daily_stats queries
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(date);
CREATE INDEX IF NOT EXISTS idx_daily_stats_metric_type ON daily_stats(metric_type);
CREATE INDEX IF NOT EXISTS idx_daily_stats_composite ON daily_stats(date, metric_type);
