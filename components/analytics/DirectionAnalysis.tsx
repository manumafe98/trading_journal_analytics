'use client';

import { ArrowUpDownIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { DirectionStats, TradeDirection } from '@/data/analytics/types';
import { PnlValue, WinRateValue } from './AnalyticsCard';

interface DirectionAnalysisProps {
  data: DirectionStats[];
  summary: string;
}

export function DirectionAnalysis({ data, summary }: DirectionAnalysisProps) {
  const longData = data.find(({ direction }) => direction === TradeDirection.Long);
  const shortData = data.find(({ direction }) => direction === TradeDirection.Short);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50">
      <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <ArrowUpDownIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">Direction Analysis</h2>
        </div>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{summary}</p>
      </div>

      <div className="grid grid-cols-2 divide-x divide-gray-100 dark:divide-gray-800">
        {/* LONG */}
        <div className="p-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <ArrowUpIcon className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="text-sm font-semibold text-emerald-400">LONG</span>
          </div>
          {longData ? (
            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Trades</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{longData.total_trades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Win Rate</span>
                <WinRateValue value={longData.win_rate} />
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Net P&L</span>
                <PnlValue value={longData.net_pnl} />
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Avg RR</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">1:{longData.average_rr.toFixed(1)}</span>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-400">No long trades</p>
          )}
        </div>

        {/* SHORT */}
        <div className="p-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
              <ArrowDownIcon className="h-4 w-4 text-red-400" />
            </div>
            <span className="text-sm font-semibold text-red-400">SHORT</span>
          </div>
          {shortData ? (
            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Trades</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{shortData.total_trades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Win Rate</span>
                <WinRateValue value={shortData.win_rate} />
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Net P&L</span>
                <PnlValue value={shortData.net_pnl} />
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Avg RR</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">1:{shortData.average_rr.toFixed(1)}</span>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-400">No short trades</p>
          )}
        </div>
      </div>
    </div>
  );
}
