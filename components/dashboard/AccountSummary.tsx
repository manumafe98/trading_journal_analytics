'use client';

import { accountSummary } from '@/data/dashboard/sampleData';
import {
  TrendingUpIcon,
  TargetIcon,
  BarChart3Icon,
  ScaleIcon,
} from 'lucide-react';

import { StatsCard } from '@/components/shared';

export function AccountSummarySection() {
  return (
    <section>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        <StatsCard
          label="Total Balance"
          value={accountSummary.totalBalance}
          icon={<ScaleIcon />}
        />
        <StatsCard
          label="Total P&L"
          value={accountSummary.totalPnl}
          icon={<TrendingUpIcon />}
          accent
          trend={accountSummary.totalPnl.startsWith('-') ? 'negative' : 'positive'}
        />
        <StatsCard
          label="P&L %"
          value={`+${accountSummary.totalPnlPercent}%`}
          icon={<BarChart3Icon />}
          trend="positive"
        />
        <StatsCard
          label="Win Rate"
          value={accountSummary.winRate}
          icon={<TargetIcon />}
          trend={parseFloat(accountSummary.winRate) >= 50 ? 'positive' : 'negative'}
        />
        <StatsCard
          label="Total Trades"
          value={String(accountSummary.totalTrades)}
          icon={<BarChart3Icon />}
        />
        <StatsCard
          label="Profit Factor"
          value={accountSummary.profitFactor}
          icon={<TrendingUpIcon />}
          accent
          trend={parseFloat(accountSummary.profitFactor) >= 1 ? 'positive' : 'negative'}
        />
        <StatsCard
          label="Avg R:R"
          value={accountSummary.avgRrr}
          icon={<TargetIcon />}
          trend={parseFloat(accountSummary.avgRrr.split(':')[1]) >= 1 ? 'positive' : 'negative'}
        />
        <StatsCard
          label="Status"
          value="Normal"
          icon={<ScaleIcon />}
        />
      </div>
    </section>
  );
}
