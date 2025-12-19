import type { AnalyticsStats } from '@/types/analytics';

interface StatsOverviewProps {
  stats: AnalyticsStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  // Calculate trend percentages
  const todayVsYesterday = stats.yesterday.views > 0
    ? ((stats.today.views - stats.yesterday.views) / stats.yesterday.views) * 100
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Today's Views */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          Today
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {stats.today.views.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {stats.today.unique_visitors.toLocaleString()} unique visitors
        </div>
        {todayVsYesterday !== 0 && (
          <div className={`mt-2 text-sm font-medium ${todayVsYesterday > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {todayVsYesterday > 0 ? '+' : ''}{todayVsYesterday.toFixed(1)}% vs yesterday
          </div>
        )}
      </div>

      {/* Yesterday's Views */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          Yesterday
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {stats.yesterday.views.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {stats.yesterday.unique_visitors.toLocaleString()} unique visitors
        </div>
      </div>

      {/* Last 7 Days */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          Last 7 Days
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {stats.last_7_days.views.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {stats.last_7_days.unique_visitors.toLocaleString()} unique visitors
        </div>
      </div>

      {/* Last 30 Days */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          Last 30 Days
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {stats.last_30_days.views.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {stats.last_30_days.unique_visitors.toLocaleString()} unique visitors
        </div>
      </div>
    </div>
  );
}
