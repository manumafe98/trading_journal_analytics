'use client';

import { ZapIcon } from 'lucide-react';
import { StyleStats } from '@/data/analytics/types';
import { AnalyticsCard, PnlValue, WinRateValue, type ColumnDef } from './AnalyticsCard';

interface StyleTableProps {
  data: StyleStats[];
  summary: string;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

const styleColumns: ColumnDef<StyleStats>[] = [
  { key: 'style', label: 'Style', render: (item) => {
    const colors: Record<string, string> = {
      'SCALPING': 'bg-cyan-500/10 text-cyan-400',
      'DAY': 'bg-blue-500/10 text-blue-400',
      'SWING': 'bg-violet-500/10 text-violet-400',
    };
    const colorClass = colors[item.style] || 'bg-gray-500/10 text-gray-400';
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}>
        {item.style}
      </span>
    );
  }},
  { key: 'trades', label: 'Trades', align: 'right', render: (item) => item.total_trades },
  { key: 'winRate', label: 'Win Rate', align: 'right', render: (item) => <WinRateValue value={item.win_rate} /> },
  { key: 'pnl', label: 'Net P&L', align: 'right', render: (item) => <PnlValue value={item.net_pnl} /> },
  { key: 'rr', label: 'Avg RR', align: 'right', render: (item) => `1:${item.average_rr.toFixed(1)}` },
  { key: 'duration', label: 'Avg Duration', align: 'right', render: (item) => formatDuration(item.average_duration_minutes) },
];

export function StyleTable({ data, summary }: StyleTableProps) {
  return (
    <AnalyticsCard
      title="Trading Styles"
      summary={summary}
      icon={<ZapIcon className="h-4 w-4" />}
      columns={styleColumns}
      data={data}
    />
  );
}
