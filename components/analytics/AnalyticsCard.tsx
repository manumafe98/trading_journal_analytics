'use client';

import { AlertTriangleIcon } from 'lucide-react';

export interface ColumnDef<T> {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
}

interface AnalyticsCardProps<T> {
  title?: string;
  summary?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  columns: ColumnDef<T>[];
  data: T[];
  emptyMessage?: string;
  className?: string;
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
  action,
  columns,
  data,
  emptyMessage = 'No data available.',
  className = '',
}: AnalyticsCardProps<T>) {
  return (
    <div className={`group relative overflow-hidden flex flex-col rounded-xl border border-gray-200/50 bg-white/60 transition-all duration-200 hover:border-gray-300 hover:shadow-xl dark:border-white/[0.05] dark:bg-[#121417]/80 dark:backdrop-blur-md dark:hover:border-white/10 dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${className}`}>
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:bg-[radial-gradient(circle_at_top_right,rgba(163,230,96,0.05),transparent_50%)]" />
      <div className="relative border-b border-gray-200/50 px-5 py-4 dark:border-white/5 shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {icon && <span className="text-gray-400 dark:text-gray-500">{icon}</span>}
              {title && <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">{title}</h2>}
            </div>
            {summary && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{summary}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="p-8 text-center text-sm text-gray-400 dark:text-gray-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200/50 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50 dark:divide-white/5">
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
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
