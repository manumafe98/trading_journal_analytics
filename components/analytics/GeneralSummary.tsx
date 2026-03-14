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

import { StatsCard } from '@/components/shared';
import { formatDuration } from '@/lib/utils';



interface GeneralSummaryGridProps {
  data: GeneralSummary;
}

export function GeneralSummaryGrid({ data }: GeneralSummaryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      <StatsCard
        label="Total Trades"
        value={data.total_trades.toString()}
        icon={<BarChart3Icon />}
      />
      <StatsCard
        label="Win Rate"
        value={`${data.win_rate}%`}
        icon={<PercentIcon />}
        trend={data.win_rate >= 50 ? 'positive' : 'negative'}
      />
      <StatsCard
        label="Net P&L"
        value={`$${data.total_net_pnl.toFixed(2)}`}
        icon={<DollarSignIcon />}
        trend={data.total_net_pnl >= 0 ? 'positive' : 'negative'}
      />
      <StatsCard
        label="Profit Factor"
        value={data.profit_factor.toFixed(2)}
        icon={<ScaleIcon />}
        trend={data.profit_factor >= 1 ? 'positive' : 'negative'}
      />
      <StatsCard
        label="Avg R:R"
        value={`1:${data.average_rr.toFixed(1)}`}
        icon={<TargetIcon />}
        trend={data.average_rr >= 1 ? 'positive' : 'negative'}
      />
      <StatsCard
        label="Avg P&L/Trade"
        value={`$${data.average_pnl_per_trade.toFixed(2)}`}
        icon={<ActivityIcon />}
        trend={data.average_pnl_per_trade >= 0 ? 'positive' : 'negative'}
      />
      <StatsCard
        label="Winning Trades"
        value={data.total_wins.toString()}
        icon={<TrendingUpIcon />}
        trend="positive"
        subtitle={`of ${data.total_trades}`}
      />
      <StatsCard
        label="Losing Trades"
        value={data.total_losses.toString()}
        icon={<TrendingDownIcon />}
        trend="negative"
        subtitle={`of ${data.total_trades}`}
      />
      <StatsCard
        label="Break Even"
        value={data.total_break_even.toString()}
        icon={<MinusIcon />}
        subtitle={`of ${data.total_trades}`}
      />
      <StatsCard
        label="Largest Win"
        value={`$${data.largest_win.toFixed(2)}`}
        icon={<TrophyIcon />}
        trend="positive"
      />
      <StatsCard
        label="Largest Loss"
        value={`$${data.largest_loss.toFixed(2)}`}
        icon={<ZapIcon />}
        trend="negative"
      />
      <StatsCard
        label="Avg Duration"
        value={formatDuration(data.average_duration_minutes)}
        icon={<ClockIcon />}
      />
    </div>
  );
}
