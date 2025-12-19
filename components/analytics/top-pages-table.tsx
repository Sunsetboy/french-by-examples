'use client';

import { useState } from 'react';
import type { PageStat } from '@/types/analytics';

interface TopPagesTableProps {
  pages: PageStat[];
}

export function TopPagesTable({ pages }: TopPagesTableProps) {
  const [sortBy, setSortBy] = useState<'views' | 'unique_visitors'>('views');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedPages = [...pages].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
  });

  const handleSort = (column: 'views' | 'unique_visitors') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Top Pages
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Page
              </th>
              <th
                className="text-right py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200"
                onClick={() => handleSort('views')}
              >
                Views {sortBy === 'views' && (sortOrder === 'desc' ? '↓' : '↑')}
              </th>
              <th
                className="text-right py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200"
                onClick={() => handleSort('unique_visitors')}
              >
                Unique {sortBy === 'unique_visitors' && (sortOrder === 'desc' ? '↓' : '↑')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPages.map((page, index) => (
              <tr
                key={page.path}
                className="border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <td className="py-3 px-2 text-sm text-gray-900 dark:text-gray-100 font-mono">
                  {page.path}
                </td>
                <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-400 text-right">
                  {page.views.toLocaleString()}
                </td>
                <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-400 text-right">
                  {page.unique_visitors.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
