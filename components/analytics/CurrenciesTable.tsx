'use client';

import { useState } from 'react';
import { BanknoteIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import { CurrencyStats } from '@/data/analytics/types';
import { AnalyticsCard, PnlValue, WinRateValue, LowSampleBadge, type ColumnDef } from './AnalyticsCard';

interface CurrenciesTableProps {
  bestCurrencies: CurrencyStats[];
  worstCurrencies: CurrencyStats[];
  bestSummary: string;
  worstSummary: string;
}

const currencyColumns: ColumnDef<CurrencyStats>[] = [
  { key: 'currency', label: 'Currency', render: (item) => (
    <div className="flex items-center gap-2">
      <span className="font-medium text-gray-900 dark:text-gray-100">{item.currency}</span>
      {item.low_sample && <LowSampleBadge />}
    </div>
  )},
  { key: 'trades', label: 'Trades', align: 'right', render: (item) => item.total_trades },
  { key: 'winRate', label: 'Win Rate', align: 'right', render: (item) => <WinRateValue value={item.win_rate} /> },
  { key: 'pnl', label: 'Net P&L', align: 'right', render: (item) => <PnlValue value={item.net_pnl} /> },
];

export function CurrenciesTable({ bestCurrencies, worstCurrencies, bestSummary, worstSummary }: CurrenciesTableProps) {
  const [view, setView] = useState<'best' | 'worst'>('best');

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50">
      <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BanknoteIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">Currency Performance</h2>
          </div>
          <div className="flex gap-1 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-800">
            <button
              onClick={() => setView('best')}
              className={`cursor-pointer flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                view === 'best'
                  ? 'bg-white text-emerald-600 shadow-sm dark:bg-gray-700 dark:text-emerald-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <TrendingUpIcon className="h-3 w-3" />
              Best
            </button>
            <button
              onClick={() => setView('worst')}
              className={`cursor-pointer flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                view === 'worst'
                  ? 'bg-white text-red-600 shadow-sm dark:bg-gray-700 dark:text-red-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <TrendingDownIcon className="h-3 w-3" />
              Worst
            </button>
          </div>
        </div>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {view === 'best' ? bestSummary : worstSummary}
        </p>
      </div>

      <AnalyticsCard
        title=""
        columns={currencyColumns}
        data={view === 'best' ? bestCurrencies : worstCurrencies}
      />
    </div>
  );
}
