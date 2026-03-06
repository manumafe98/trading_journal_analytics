'use client';

import { AlertTriangleIcon } from 'lucide-react';

export interface ColumnDef<T> {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
}

interface AnalyticsCardProps<T> {
  title: string;
  summary?: string;
  icon?: React.ReactNode;
  columns: ColumnDef<T>[];
  data: T[];
  emptyMessage?: string;
}

function PnlValue({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <span className={`font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
      {isPositive ? '+' : ''}${value.toFixed(2)}
    </span>
  );
}

function WinRateValue({ value }: { value: number }) {
  const color = value >= 60 ? 'text-emerald-400' : value >= 45 ? 'text-amber-400' : 'text-red-400';
  return <span className={`font-medium ${color}`}>{value}%</span>;
}

function LowSampleBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">
      <AlertTriangleIcon className="h-2.5 w-2.5" />
      Low sample
    </span>
  );
}

export { PnlValue, WinRateValue, LowSampleBadge };

export function AnalyticsCard<T>({
  title,
  summary,
  icon,
  columns,
  data,
  emptyMessage = 'No data available.',
}: AnalyticsCardProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50">
      <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <div className="flex items-center gap-2">
          {icon && <span className="text-gray-400 dark:text-gray-500">{icon}</span>}
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">{title}</h2>
        </div>
        {summary && (
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{summary}</p>
        )}
      </div>

      {data.length === 0 ? (
        <div className="p-8 text-center text-sm text-gray-400 dark:text-gray-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 ${
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      }`}
                    >
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
