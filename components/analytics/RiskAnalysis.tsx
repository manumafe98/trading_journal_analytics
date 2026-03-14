'use client';

import { ShieldAlertIcon } from 'lucide-react';
import { RiskAnalysis, RiskLevelStats } from '@/data/analytics/types';
import { AnalyticsCard, PnlValue, WinRateValue, type ColumnDef } from './AnalyticsCard';

interface RiskAnalysisCardProps {
  data: RiskAnalysis;
  summary: string;
}

const riskColumns: ColumnDef<RiskLevelStats>[] = [
  { key: 'level', label: 'Risk Level', render: (item) => (
    <span className="font-medium text-gray-900 dark:text-gray-100">{item.risk_level}</span>
  )},
  { key: 'trades', label: 'Trades', align: 'right', render: (item) => item.total_trades },
  { key: 'winRate', label: 'Win Rate', align: 'right', render: (item) => <WinRateValue value={item.win_rate} /> },
  { key: 'pnl', label: 'Net P&L', align: 'right', render: (item) => <PnlValue value={item.net_pnl} /> },
];

export function RiskAnalysisCard({ data, summary }: RiskAnalysisCardProps) {
  return (
    <AnalyticsCard
      title="Risk Analysis"
      summary={summary}
      icon={<ShieldAlertIcon className="h-4 w-4" />}
      columns={riskColumns}
      data={data.by_risk_level}
    />
  );
}
