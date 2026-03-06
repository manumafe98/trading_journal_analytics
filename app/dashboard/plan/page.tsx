'use client';

import { TargetIcon } from 'lucide-react';

export default function TradingPlanPage() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white/50 p-12 text-center dark:border-gray-800 dark:bg-gray-900/50">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <TargetIcon className="h-8 w-8 text-primary" />
      </div>
      <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-gray-50">Trading Plan</h2>
      <p className="mx-auto mt-2 max-w-sm text-balance text-gray-500 dark:text-gray-400">
        Your strategic trading framework will be displayed here. Define your rules, setups, and risk management parameters.
      </p>
      <div className="mt-8">
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
          Coming Soon
        </span>
      </div>
    </div>
  );
}
