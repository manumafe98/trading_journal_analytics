'use client';

import { tradingObjectives, type TradingObjective } from '@/data/dashboard/sampleData';

export function TradingObjectivesGrid() {
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-50">
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
    <div className="rounded-xl border border-gray-200 bg-white p-4 transition-colors dark:border-gray-800 dark:bg-surface">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {objective.label}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${style.badge}`}
        >
          {style.label}
        </span>
      </div>

      {/* Value / Target */}
      <div className="mb-3 flex items-baseline gap-1">
        <span className="text-lg font-bold text-gray-900 dark:text-gray-50">
          {objective.value}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          / {objective.target}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
          style={{ width: `${Math.min(objective.progress, 100)}%` }}
        />
      </div>
    </div>
  );
}
