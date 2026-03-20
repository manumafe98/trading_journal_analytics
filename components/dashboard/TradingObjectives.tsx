'use client';

import { tradingObjectives, type TradingObjective } from '@/data/dashboard/sampleData';
import { cn } from '@/lib/utils';

export function TradingObjectivesGrid() {
  return (
    <section>
      <h3 className="mb-4 text-sm font-semibold tracking-wide text-gray-900 dark:text-gray-50/80 uppercase">
        Trading Objectives
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tradingObjectives.map((obj) => (
          <ObjectiveCard key={obj.label} objective={obj} />
        ))}
      </div>
    </section>
  );
}

function ObjectiveCard({ objective }: { objective: TradingObjective }) {
  const statusStyles = {
    'on-track': {
      badge: 'bg-primary/10 text-primary border border-primary/20',
      bar: 'bg-primary',
      label: 'On Track',
    },
    'at-risk': {
      badge: 'bg-accent-warning/10 text-accent-warning border border-accent-warning/20',
      bar: 'bg-accent-warning',
      label: 'At Risk',
    },
    exceeded: {
      badge: 'bg-secondary/10 text-secondary border border-secondary/20',
      bar: 'bg-secondary',
      label: 'Exceeded',
    },
  };

  const style = statusStyles[objective.status];

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-gray-200/50 bg-white/60 p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-xl dark:border-white/[0.05] dark:bg-[#121417]/80 dark:backdrop-blur-md dark:hover:border-white/10 dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]'
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:bg-[radial-gradient(circle_at_top_right,rgba(163,230,96,0.05),transparent_50%)]" />
      <div className="relative">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {objective.label}
          </span>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium transition-colors duration-300',
              style.badge
            )}
          >
            {style.label}
          </span>
        </div>

        {/* Value / Target */}
        <div className="mb-3 flex items-baseline gap-1">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-50 transition-colors duration-300">
            {objective.value}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            / {objective.target}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-200',
              style.bar
            )}
            style={{ width: `${Math.min(objective.progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
