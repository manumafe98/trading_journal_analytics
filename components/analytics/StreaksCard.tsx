'use client';

import { FlameIcon, SnowflakeIcon, TrendingUpIcon } from 'lucide-react';
import { StreaksData } from '@/data/analytics/types';

interface StreaksCardProps {
  data: StreaksData;
  summary: string;
}

export function StreaksCard({ data, summary }: StreaksCardProps) {
  const currentStreakColor = data.current_streak.type === 'win'
    ? 'text-emerald-400'
    : data.current_streak.type === 'loss'
      ? 'text-red-400'
      : 'text-gray-400';

  const currentStreakBg = data.current_streak.type === 'win'
    ? 'bg-emerald-500/10 border-emerald-500/20'
    : data.current_streak.type === 'loss'
      ? 'bg-red-500/10 border-red-500/20'
      : 'bg-gray-500/10 border-gray-500/20';

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50">
      <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">Streaks</h2>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{summary}</p>
      </div>

      <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-gray-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {/* Longest Win Streak */}
        <div className="flex items-center gap-4 px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
            <FlameIcon className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Best Win Streak
            </p>
            <p className="mt-0.5 text-2xl font-bold text-emerald-400">
              {data.longest_win_streak}
            </p>
          </div>
        </div>

        {/* Longest Loss Streak */}
        <div className="flex items-center gap-4 px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
            <SnowflakeIcon className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Worst Loss Streak
            </p>
            <p className="mt-0.5 text-2xl font-bold text-red-400">
              {data.longest_loss_streak}
            </p>
          </div>
        </div>

        {/* Current Streak */}
        <div className="flex items-center gap-4 px-5 py-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${currentStreakBg}`}>
            <TrendingUpIcon className={`h-5 w-5 ${currentStreakColor}`} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Current Streak
            </p>
            <p className={`mt-0.5 text-2xl font-bold ${currentStreakColor}`}>
              {data.current_streak.count}{' '}
              <span className="text-sm font-medium capitalize">{data.current_streak.type}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
