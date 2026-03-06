'use client';

import { GlobeIcon } from 'lucide-react';
import { SessionStats } from '@/data/analytics/types';
import { AnalyticsCard, PnlValue, WinRateValue, type ColumnDef } from './AnalyticsCard';

interface SessionsTableProps {
  data: SessionStats[];
  summary: string;
}

const sessionColumns: ColumnDef<SessionStats>[] = [
  { key: 'session', label: 'Session', render: (item) => {
    const colors: Record<string, string> = {
      'Asian': 'bg-purple-500/10 text-purple-400',
      'London': 'bg-blue-500/10 text-blue-400',
      'New York': 'bg-amber-500/10 text-amber-400',
      'Overlap': 'bg-emerald-500/10 text-emerald-400',
      'Off-Hours': 'bg-gray-500/10 text-gray-400',
    };
    const colorClass = colors[item.session] || 'bg-gray-500/10 text-gray-400';
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}>
        {item.session}
      </span>
    );
  }},
  { key: 'trades', label: 'Trades', align: 'right', render: (item) => item.total_trades },
  { key: 'winRate', label: 'Win Rate', align: 'right', render: (item) => <WinRateValue value={item.win_rate} /> },
  { key: 'pnl', label: 'Net P&L', align: 'right', render: (item) => <PnlValue value={item.net_pnl} /> },
  { key: 'rr', label: 'Avg RR', align: 'right', render: (item) => `1:${item.average_rr.toFixed(1)}` },
];

export function SessionsTable({ data, summary }: SessionsTableProps) {
  return (
    <AnalyticsCard
      title="Trading Sessions"
      summary={summary}
      icon={<GlobeIcon className="h-4 w-4" />}
      columns={sessionColumns}
      data={data}
    />
  );
}
