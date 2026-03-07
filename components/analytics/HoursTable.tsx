'use client';

import { useState } from 'react';
import { ClockIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import { HourStats } from '@/data/analytics/types';
import { AnalyticsCard, PnlValue, WinRateValue, LowSampleBadge, type ColumnDef } from './AnalyticsCard';

interface HoursTableProps {
  bestHours: HourStats[];
  worstHours: HourStats[];
  bestSummary: string;
}

const hourColumns: ColumnDef<HourStats>[] = [
  { key: 'hour', label: 'Hour', render: (item) => (
    <div className="flex items-center gap-2">
      <span className="font-medium text-gray-900 dark:text-gray-100">{item.hour}</span>
      {item.low_sample && <LowSampleBadge />}
    </div>
  )},
  { key: 'trades', label: 'Trades', align: 'right', render: (item) => item.total_trades },
  { key: 'winRate', label: 'Win Rate', align: 'right', render: (item) => <WinRateValue value={item.win_rate} /> },
  { key: 'pnl', label: 'Net P&L', align: 'right', render: (item) => <PnlValue value={item.net_pnl} /> },
];

export function HoursTable({ bestHours, worstHours, bestSummary }: HoursTableProps) {
  const [view, setView] = useState<'best' | 'worst'>('best');

  const action = (
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
  );

  return (
    <AnalyticsCard
      title="Hours Performance"
      summary={bestSummary}
      icon={<ClockIcon className="h-4 w-4" />}
      action={action}
      columns={hourColumns}
      data={view === 'best' ? bestHours : worstHours}
      className="h-[390px]"
    />
  );
}
