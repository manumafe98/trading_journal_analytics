'use client';

import { useState } from 'react';
import { pnlBarDataWeekly, pnlBarDataMonthly, type PnlBarData } from '@/data/dashboard/sampleData';
import { cn } from '@/lib/utils';

interface PnlChartCardProps {
  className?: string;
}

export function PnlChartCard({ className = '' }: PnlChartCardProps) {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const data = period === 'weekly' ? pnlBarDataWeekly : pnlBarDataMonthly;
  const maxAbsValue = Math.max(...data.map((d) => Math.abs(d.value)));

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
            Profit / Loss
          </h3>
          <div className="mt-1 text-2xl font-bold text-primary">
            +$12,340.50
          </div>
        </div>
        <PeriodToggle period={period} onChange={setPeriod} />
      </div>

      {/* Bar chart */}
      <div className="flex items-end justify-between gap-1.5 pt-4" style={{ height: '12rem' }}>
        {data.map((bar, i) => (
          <BarColumn key={`${bar.label}-${i}`} bar={bar} maxAbsValue={maxAbsValue} />
        ))}
      </div>
    </div>
  );
}

// ── Internal Components ──────────────────────────────────────────────────────

function PeriodToggle({
  period,
  onChange,
}: {
  period: 'weekly' | 'monthly';
  onChange: (v: 'weekly' | 'monthly') => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 p-0.5 dark:border-gray-800 dark:bg-gray-900">
      <button
        onClick={() => onChange('weekly')}
        className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          period === 'weekly'
            ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-gray-50'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
        }`}
      >
        W
      </button>
      <button
        onClick={() => onChange('monthly')}
        className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          period === 'monthly'
            ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-gray-50'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
        }`}
      >
        M
      </button>
    </div>
  );
}

function BarColumn({ bar, maxAbsValue }: { bar: PnlBarData; maxAbsValue: number }) {
  const isPositive = bar.value >= 0;
  const heightPercent = maxAbsValue === 0 ? 0 : (Math.abs(bar.value) / maxAbsValue) * 100;

  return (
    <div className="flex flex-1 flex-col items-center gap-1.5">
      <div className="relative flex w-full items-end justify-center" style={{ height: '9rem' }}>
        <div
          className={`w-full max-w-[1.5rem] rounded-t transition-all duration-300 ${
            isPositive
              ? 'bg-gradient-to-b from-primary to-primary/40 shadow-neon-glow'
              : 'bg-accent-negative/80'
          }`}
          style={{
            height: `${Math.max(heightPercent, 2)}%`,
          }}
        />
      </div>
      <span className="text-[0.625rem] font-medium text-gray-500 dark:text-gray-400">
        {bar.label}
      </span>
    </div>
  );
}
