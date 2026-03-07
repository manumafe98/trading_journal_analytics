'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { equityCurveData } from '@/data/dashboard/sampleData';
import { cn } from '@/lib/utils';

interface EquityChartCardProps {
  className?: string;
}

export function EquityChartCard({ className = '' }: EquityChartCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:border-gray-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-gray-700',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-gradient-to-br dark:from-primary/5 dark:to-transparent" />
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Account Balance
          </h3>
          <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-50">
            $128,450.32
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          +10.62%
        </div>
      </div>

      {/* Chart */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={equityCurveData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a3e660" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#a3e660" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              className="text-gray-100 dark:text-gray-800"
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
              className="text-gray-400 dark:text-gray-500"
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              width={50}
              className="text-gray-400 dark:text-gray-500"
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="equity"
              stroke="#a3e660"
              strokeWidth={2}
              fill="url(#equityGradient)"
              dot={false}
              activeDot={{
                r: 5,
                stroke: '#a3e660',
                strokeWidth: 2,
                fill: '#121214',
                className: 'drop-shadow-[0_0_6px_rgba(163,230,96,0.5)]',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-1 text-xs text-gray-400">{label}</div>
      <div className="text-sm font-bold text-gray-900 dark:text-gray-50">
        ${payload[0].value.toLocaleString()}
      </div>
    </div>
  );
}
