'use client';

import { TradingHistoryTable } from '@/components/dashboard';

export default function TradesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          Trade History
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          A comprehensive list of all your executed trades and their performance.
        </p>
      </div>

      <div className="mt-6">
        <TradingHistoryTable />
      </div>
    </div>
  );
}
