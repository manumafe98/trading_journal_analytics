'use client';

import { PsicotradingTab } from '@/components/psychology';

export default function PsicotradingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          Psicotrading Journal
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Emotional tracking and psychological analysis. Monitor your mindset, discipline, and behavioral patterns.
        </p>
      </div>

      <div className="mt-6">
        <PsicotradingTab />
      </div>
    </div>
  );
}
