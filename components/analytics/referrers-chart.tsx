'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { ReferrerStat } from '@/types/analytics';

interface ReferrersChartProps {
  referrers: ReferrerStat[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'];

export function ReferrersChart({ referrers }: ReferrersChartProps) {
  // Show top 5 + "Others"
  const topReferrers = referrers.slice(0, 5);
  const othersCount = referrers.slice(5).reduce((sum, r) => sum + r.visits, 0);

  const chartData = [
    ...topReferrers.map(r => ({
      name: r.referrer === '(direct)' ? 'Direct' : r.referrer,
      value: r.visits
    })),
    ...(othersCount > 0 ? [{ name: 'Others', value: othersCount }] : [])
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Traffic Sources
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
