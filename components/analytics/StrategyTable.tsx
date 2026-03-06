'use client';

import { SwordsIcon } from 'lucide-react';
import { StrategyStats } from '@/data/analytics/types';
import { AnalyticsCard, PnlValue, WinRateValue, type ColumnDef } from './AnalyticsCard';

interface StrategyTableProps {
  data: StrategyStats[];
  summary: string;
}

const strategyColumns: ColumnDef<StrategyStats>[] = [
  { key: 'strategy', label: 'Strategy', render: (item) => {
    const colors: Record<string, string> = {
      'BLUE': 'bg-blue-500/10 text-blue-400',
      'RED': 'bg-red-500/10 text-red-400',
      'GREEN': 'bg-emerald-500/10 text-emerald-400',
    };
    const colorClass = colors[item.strategy] || 'bg-gray-500/10 text-gray-400';
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}>
        {item.strategy}
      </span>
    );
  }},
  { key: 'trades', label: 'Trades', align: 'right', render: (item) => item.total_trades },
  { key: 'winRate', label: 'Win Rate', align: 'right', render: (item) => <WinRateValue value={item.win_rate} /> },
  { key: 'pnl', label: 'Net P&L', align: 'right', render: (item) => <PnlValue value={item.net_pnl} /> },
  { key: 'rr', label: 'Avg RR', align: 'right', render: (item) => `1:${item.average_rr.toFixed(1)}` },
];

export function StrategyTable({ data, summary }: StrategyTableProps) {
  return (
    <AnalyticsCard
      title="Strategies"
      summary={summary}
      icon={<SwordsIcon className="h-4 w-4" />}
      columns={strategyColumns}
      data={data}
    />
  );
}
