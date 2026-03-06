'use client';

import { CalendarIcon } from 'lucide-react';
import { MonthStats, MonthlyPerformance } from '@/data/analytics/types';
import { AnalyticsCard, PnlValue, WinRateValue, type ColumnDef } from './AnalyticsCard';

interface MonthlyPerformanceCardProps {
  data: MonthlyPerformance;
  summary: string;
}

const monthColumns: ColumnDef<MonthStats>[] = [
  { key: 'month', label: 'Month', render: (item) => (
    <span className="font-medium text-gray-900 dark:text-gray-100">{item.month}</span>
  )},
  { key: 'trades', label: 'Trades', align: 'right', render: (item) => item.total_trades },
  { key: 'winRate', label: 'Win Rate', align: 'right', render: (item) => <WinRateValue value={item.win_rate} /> },
  { key: 'pnl', label: 'Net P&L', align: 'right', render: (item) => <PnlValue value={item.net_pnl} /> },
];

export function MonthlyPerformanceCard({ data, summary }: MonthlyPerformanceCardProps) {
  return (
    <AnalyticsCard
      title="Monthly Performance"
      summary={summary}
      icon={<CalendarIcon className="h-4 w-4" />}
      columns={monthColumns}
      data={data.data}
    />
  );
}
