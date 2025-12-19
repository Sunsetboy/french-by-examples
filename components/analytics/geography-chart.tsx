'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { GeographyStat } from '@/types/analytics';

interface GeographyChartProps {
  geography: GeographyStat[];
}

export function GeographyChart({ geography }: GeographyChartProps) {
  // Show top 10 countries
  const topCountries = geography.slice(0, 10);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Visitors by Country
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topCountries} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
          <YAxis
            type="category"
            dataKey="country"
            stroke="#9CA3AF"
            fontSize={12}
            width={100}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
          />
          <Bar dataKey="views" fill="#3B82F6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
