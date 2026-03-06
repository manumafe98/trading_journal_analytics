'use client';

import { CalendarDaysIcon } from 'lucide-react';
import { DayStats } from '@/data/analytics/types';
import { AnalyticsCard, PnlValue, WinRateValue, type ColumnDef } from './AnalyticsCard';

interface DaysOfWeekTableProps {
  bestDays: DayStats[];
  worstDays: DayStats[];
  bestSummary: string;
}

const dayColumns: ColumnDef<DayStats>[] = [
  { key: 'day', label: 'Day', render: (item) => (
    <span className="font-medium text-gray-900 dark:text-gray-100">{item.day}</span>
  )},
  { key: 'trades', label: 'Trades', align: 'right', render: (item) => item.total_trades },
  { key: 'winRate', label: 'Win Rate', align: 'right', render: (item) => <WinRateValue value={item.win_rate} /> },
  { key: 'pnl', label: 'Net P&L', align: 'right', render: (item) => <PnlValue value={item.net_pnl} /> },
  { key: 'rr', label: 'Avg RR', align: 'right', render: (item) => `1:${item.average_rr.toFixed(1)}` },
];

export function DaysOfWeekTable({ bestDays, bestSummary }: DaysOfWeekTableProps) {
  return (
    <AnalyticsCard
      title="Days of the Week"
      summary={bestSummary}
      icon={<CalendarDaysIcon className="h-4 w-4" />}
      columns={dayColumns}
      data={bestDays}
    />
  );
}
