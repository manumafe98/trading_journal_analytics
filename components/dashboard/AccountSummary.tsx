'use client';

import { accountSummary } from '@/data/dashboard/sampleData';
import {
  TrendingUpIcon,
  TargetIcon,
  BarChart3Icon,
  ScaleIcon,
} from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: boolean;
}

function StatCard({ label, value, icon, accent = false }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 transition-colors dark:border-gray-800 dark:bg-surface">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {label}
        </span>
        <span className="text-gray-400 dark:text-gray-600">{icon}</span>
      </div>
      <div
        className={`text-xl font-bold ${
          accent ? 'text-primary' : 'text-gray-900 dark:text-gray-50'
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export function AccountSummarySection() {
  return (
    <section>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
        <StatCard
          label="Total Balance"
          value={accountSummary.totalBalance}
          icon={<ScaleIcon className="h-4 w-4" />}
        />
        <StatCard
          label="Total P&L"
          value={accountSummary.totalPnl}
          icon={<TrendingUpIcon className="h-4 w-4" />}
          accent
        />
        <StatCard
          label="P&L %"
          value={`+${accountSummary.totalPnlPercent}%`}
          icon={<BarChart3Icon className="h-4 w-4" />}
        />
        <StatCard
          label="Win Rate"
          value={accountSummary.winRate}
          icon={<TargetIcon className="h-4 w-4" />}
        />
        <StatCard
          label="Total Trades"
          value={String(accountSummary.totalTrades)}
          icon={<BarChart3Icon className="h-4 w-4" />}
        />
        <StatCard
          label="Profit Factor"
          value={accountSummary.profitFactor}
          icon={<TrendingUpIcon className="h-4 w-4" />}
          accent
        />
        <StatCard
          label="Avg R:R"
          value={accountSummary.avgRrr}
          icon={<TargetIcon className="h-4 w-4" />}
        />
        <StatCard
          label="Status"
          value="Normal"
          icon={<ScaleIcon className="h-4 w-4" />}
        />
      </div>
    </section>
  );
}
