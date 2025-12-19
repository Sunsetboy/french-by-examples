'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { RealtimeEvent } from '@/types/analytics';

interface RealtimeFeedProps {
  initialEvents: RealtimeEvent[];
  refreshInterval?: number; // in milliseconds
}

export function RealtimeFeed({ initialEvents, refreshInterval = 30000 }: RealtimeFeedProps) {
  const [events, setEvents] = useState<RealtimeEvent[]>(initialEvents);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      setIsRefreshing(true);
      try {
        const response = await fetch('/api/analytics/realtime');
        if (response.ok) {
          const newEvents = await response.json();
          setEvents(newEvents);
        }
      } catch (error) {
        console.error('Failed to refresh realtime events:', error);
      } finally {
        setIsRefreshing(false);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Realtime Activity
        </h3>
        <div className="flex items-center gap-2">
          {isRefreshing && (
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Updates every 30s
          </span>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {events.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No recent activity
          </div>
        ) : (
          events.map((event, index) => (
            <div
              key={`${event.timestamp}-${index}`}
              className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="text-xl">{getFlagEmoji(event.country)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate font-mono">
                    {event.path}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {event.country}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                {formatDistanceToNow(event.timestamp, { addSuffix: true })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Helper function to get flag emoji from country code
function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';

  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
}
