'use client';

import { RefreshCwIcon, PercentIcon, DollarSignIcon, CalculatorIcon } from 'lucide-react';
import { SwapImpact } from '@/data/analytics/types';

interface SwapImpactCardProps {
  data: SwapImpact;
  summary: string;
}

export function SwapImpactCard({ data, summary }: SwapImpactCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50">
      <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <RefreshCwIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">Swap Impact</h2>
        </div>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{summary}</p>
      </div>

      <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-gray-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {/* Total Swap */}
        <div className="flex items-center gap-4 px-5 py-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
            <DollarSignIcon className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Total Swap
            </p>
            <p className={`mt-0.5 text-2xl font-bold ${data.total_swap >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {data.total_swap >= 0 ? '+' : ''}${data.total_swap.toFixed(2)}
            </p>
          </div>
        </div>

        {/* % of Gross P&L */}
        <div className="flex items-center gap-4 px-5 py-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
            <PercentIcon className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Impact on Gross P&L
            </p>
            <p className="mt-0.5 text-2xl font-bold text-gray-900 dark:text-gray-50">
              {data.percent_of_gross_pnl}%
            </p>
          </div>
        </div>

        {/* Avg per Trade */}
        <div className="flex items-center gap-4 px-5 py-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
            <CalculatorIcon className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Avg Swap / Trade
            </p>
            <p className="mt-0.5 text-2xl font-bold text-gray-900 dark:text-gray-50">
              ${data.average_swap_per_trade.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
