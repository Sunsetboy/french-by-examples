'use client';

import { useState, useEffect } from 'react';
import { StatsOverview } from '@/components/analytics/stats-overview';
import { PageviewsChart } from '@/components/analytics/pageviews-chart';
import { TopPagesTable } from '@/components/analytics/top-pages-table';
import { ReferrersChart } from '@/components/analytics/referrers-chart';
import { GeographyChart } from '@/components/analytics/geography-chart';
import { DevicesBreakdown } from '@/components/analytics/devices-breakdown';
import { RealtimeFeed } from '@/components/analytics/realtime-feed';
import {
  getOverviewStats,
  getTopPages,
  getReferrers,
  getDeviceStats,
  getGeographyStats,
  getRealtimeEvents,
  getPageviewsOverTime,
} from '@/lib/analytics/api-client';
import type {
  AnalyticsStats,
  PageStat,
  ReferrerStat,
  DeviceStats,
  GeographyStat,
  RealtimeEvent,
  PageviewsOverTime,
  TimePeriod,
} from '@/types/analytics';

export default function AnalyticsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dashboard data
  const [period, setPeriod] = useState<TimePeriod>('7d');
  const [overviewStats, setOverviewStats] = useState<AnalyticsStats | null>(null);
  const [pageviewsOverTime, setPageviewsOverTime] = useState<PageviewsOverTime[]>([]);
  const [topPages, setTopPages] = useState<PageStat[]>([]);
  const [referrers, setReferrers] = useState<ReferrerStat[]>([]);
  const [deviceStats, setDeviceStats] = useState<DeviceStats | null>(null);
  const [geography, setGeography] = useState<GeographyStat[]>([]);
  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([]);

  // Check authentication on mount
  useEffect(() => {
    const authToken = localStorage.getItem('analytics_auth');
    if (authToken) {
      setIsAuthenticated(true);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Load dashboard data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, period]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [
        overview,
        pageviews,
        pages,
        refs,
        devices,
        geo,
        realtime,
      ] = await Promise.all([
        getOverviewStats(),
        getPageviewsOverTime(period),
        getTopPages(period),
        getReferrers(period),
        getDeviceStats(period),
        getGeographyStats(period),
        getRealtimeEvents(),
      ]);

      setOverviewStats(overview);
      setPageviewsOverTime(pageviews);
      setTopPages(pages);
      setReferrers(refs);
      setDeviceStats(devices);
      setGeography(geo);
      setRealtimeEvents(realtime);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple password check (replace with your own password)
    // In production, this should be an environment variable
    const correctPassword = process.env.NEXT_PUBLIC_ANALYTICS_PASSWORD || 'analytics123';

    if (password === correctPassword) {
      localStorage.setItem('analytics_auth', 'true');
      setIsAuthenticated(true);
      setPassword('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('analytics_auth');
    setIsAuthenticated(false);
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="container max-w-md mx-auto px-4 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Analytics Dashboard
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password"
                autoFocus
              />
            </div>
            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Loading screen
  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
            Error Loading Analytics
          </h2>
          <p className="text-red-700 dark:text-red-300">{error}</p>
          <button
            onClick={loadDashboardData}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Dashboard screen
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Analytics Dashboard
        </h1>
        <div className="flex items-center gap-4">
          {/* Period Selector */}
          <div className="flex gap-2">
            {(['24h', '7d', '30d', '90d'] as TimePeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  period === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {overviewStats && (
        <div className="mb-8">
          <StatsOverview stats={overviewStats} />
        </div>
      )}

      {/* Pageviews Chart */}
      <div className="mb-8">
        <PageviewsChart data={pageviewsOverTime} />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <TopPagesTable pages={topPages} />
        <ReferrersChart referrers={referrers} />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <GeographyChart geography={geography} />
        {deviceStats && <DevicesBreakdown devices={deviceStats} />}
      </div>

      {/* Realtime Feed */}
      <div>
        <RealtimeFeed initialEvents={realtimeEvents} />
      </div>
    </div>
  );
}
