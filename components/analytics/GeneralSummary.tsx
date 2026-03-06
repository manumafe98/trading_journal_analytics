'use client';

import {
  TrendingUpIcon,
  TrendingDownIcon,
  TargetIcon,
  PercentIcon,
  DollarSignIcon,
  ClockIcon,
  ScaleIcon,
  ActivityIcon,
  ZapIcon,
  BarChart3Icon,
  MinusIcon,
  TrophyIcon,
} from 'lucide-react';
import { GeneralSummary } from '@/data/analytics/types';

interface KPICardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
}

function KPICard({ label, value, icon, trend = 'neutral', subtitle }: KPICardProps) {
  const trendColors = {
    positive: 'text-emerald-400',
    negative: 'text-red-400',
    neutral: 'text-gray-400 dark:text-gray-500',
  };

  const iconBgColors = {
    positive: 'bg-emerald-500/10 text-emerald-400',
    negative: 'bg-red-500/10 text-red-400',
    neutral: 'bg-gray-500/10 text-gray-400 dark:bg-gray-700/50 dark:text-gray-500',
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-gray-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-gray-700">
      {/* Subtle glow effect on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-gradient-to-br dark:from-primary/5 dark:to-transparent" />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {label}
          </p>
          <p className={`mt-1.5 text-xl font-bold tracking-tight ${trendColors[trend]} ${trend === 'neutral' ? 'text-gray-900 dark:text-gray-50' : ''}`}>
            {value}
          </p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBgColors[trend]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

interface GeneralSummaryGridProps {
  data: GeneralSummary;
}

export function GeneralSummaryGrid({ data }: GeneralSummaryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      <KPICard
        label="Total Trades"
        value={data.total_trades.toString()}
        icon={<BarChart3Icon className="h-4 w-4" />}
      />
      <KPICard
        label="Win Rate"
        value={`${data.win_rate}%`}
        icon={<PercentIcon className="h-4 w-4" />}
        trend={data.win_rate >= 50 ? 'positive' : 'negative'}
      />
      <KPICard
        label="Net P&L"
        value={`$${data.total_net_pnl.toFixed(2)}`}
        icon={<DollarSignIcon className="h-4 w-4" />}
        trend={data.total_net_pnl >= 0 ? 'positive' : 'negative'}
      />
      <KPICard
        label="Profit Factor"
        value={data.profit_factor.toFixed(2)}
        icon={<ScaleIcon className="h-4 w-4" />}
        trend={data.profit_factor >= 1 ? 'positive' : 'negative'}
      />
      <KPICard
        label="Avg R:R"
        value={`1:${data.average_rr.toFixed(1)}`}
        icon={<TargetIcon className="h-4 w-4" />}
        trend={data.average_rr >= 1 ? 'positive' : 'negative'}
      />
      <KPICard
        label="Avg P&L/Trade"
        value={`$${data.average_pnl_per_trade.toFixed(2)}`}
        icon={<ActivityIcon className="h-4 w-4" />}
        trend={data.average_pnl_per_trade >= 0 ? 'positive' : 'negative'}
      />
      <KPICard
        label="Winning Trades"
        value={data.total_wins.toString()}
        icon={<TrendingUpIcon className="h-4 w-4" />}
        trend="positive"
        subtitle={`of ${data.total_trades}`}
      />
      <KPICard
        label="Losing Trades"
        value={data.total_losses.toString()}
        icon={<TrendingDownIcon className="h-4 w-4" />}
        trend="negative"
        subtitle={`of ${data.total_trades}`}
      />
      <KPICard
        label="Break Even"
        value={data.total_break_even.toString()}
        icon={<MinusIcon className="h-4 w-4" />}
        subtitle={`of ${data.total_trades}`}
      />
      <KPICard
        label="Largest Win"
        value={`$${data.largest_win.toFixed(2)}`}
        icon={<TrophyIcon className="h-4 w-4" />}
        trend="positive"
      />
      <KPICard
        label="Largest Loss"
        value={`$${data.largest_loss.toFixed(2)}`}
        icon={<ZapIcon className="h-4 w-4" />}
        trend="negative"
      />
      <KPICard
        label="Avg Duration"
        value={formatDuration(data.average_duration_minutes)}
        icon={<ClockIcon className="h-4 w-4" />}
      />
    </div>
  );
}
