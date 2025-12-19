'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PageviewsChartProps {
  data: Array<{ date: string; views: number; unique: number }>;
}

export function PageviewsChart({ data }: PageviewsChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Pageviews Over Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis
            dataKey="date"
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
          />
          <Line
            type="monotone"
            dataKey="views"
            stroke="#3B82F6"
            strokeWidth={2}
            name="Total Views"
            dot={{ fill: '#3B82F6', r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="unique"
            stroke="#10B981"
            strokeWidth={2}
            name="Unique Visitors"
            dot={{ fill: '#10B981', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
