'use client';

import { useMemo } from 'react';
import { computeAnalytics } from '@/lib/analytics/computeAnalytics';
import { sampleTrades } from '@/data/analytics/tradeJournalData';
import { GeneralSummaryGrid } from './GeneralSummary';
import { StreaksCard } from './StreaksCard';
import { PairsTable } from './PairsTable';
import { CurrenciesTable } from './CurrenciesTable';
import { DaysOfWeekTable } from './DaysOfWeekTable';
import { HoursTable } from './HoursTable';
import { SessionsTable } from './SessionsTable';
import { StyleTable } from './StyleTable';
import { StrategyTable } from './StrategyTable';
import { DirectionAnalysis } from './DirectionAnalysis';
import { RiskAnalysisCard } from './RiskAnalysis';
import { MonthlyPerformanceCard } from './MonthlyPerformance';
import { CommissionImpactCard } from './CommissionImpact';
import { SwapImpactCard } from './SwapImpact';

export function AnalyticsPage() {
  const analytics = useMemo(() => computeAnalytics(sampleTrades), []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {analytics.general_summary.summary}
        </p>
      </div>

      {/* 1. General Summary */}
      <GeneralSummaryGrid data={analytics.general_summary.data} />

      {/* 2. Streaks */}
      <StreaksCard data={analytics.streaks.data} summary={analytics.streaks.summary} />

      {/* 3 & 4. Best & Worst Pairs and Currencies */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <PairsTable
          bestPairs={analytics.best_pairs.data}
          worstPairs={analytics.worst_pairs.data}
          bestSummary={analytics.best_pairs.summary}
          worstSummary={analytics.worst_pairs.summary}
        />
        <CurrenciesTable
          bestCurrencies={analytics.best_currencies.data}
          worstCurrencies={analytics.worst_currencies.data}
          bestSummary={analytics.best_currencies.summary}
          worstSummary={analytics.worst_currencies.summary}
        />
      </div>

      {/* 5 & 6. Days and Hours */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DaysOfWeekTable
          bestDays={analytics.best_days.data}
          worstDays={analytics.worst_days.data}
          bestSummary={analytics.best_days.summary}
        />
        <HoursTable
          bestHours={analytics.best_hours.data}
          worstHours={analytics.worst_hours.data}
          bestSummary={analytics.best_hours.summary}
        />
      </div>

      {/* 7 & 8. Sessions and Style */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <SessionsTable data={analytics.sessions.data} summary={analytics.sessions.summary} />
        <StyleTable data={analytics.styles.data} summary={analytics.styles.summary} />
      </div>

      {/* 9 & 10. Strategy and Direction */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <StrategyTable data={analytics.strategies.data} summary={analytics.strategies.summary} />
        <DirectionAnalysis data={analytics.direction.data} summary={analytics.direction.summary} />
      </div>

      {/* 11 & 12. Risk and Monthly */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <RiskAnalysisCard data={analytics.risk_analysis.data} summary={analytics.risk_analysis.summary} />
        <MonthlyPerformanceCard data={analytics.monthly_performance.data} summary={analytics.monthly_performance.summary} />
      </div>

      {/* 13 & 14. Commission and Swap Impact */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CommissionImpactCard
          data={analytics.commission_impact.data}
          summary={analytics.commission_impact.summary}
        />
        <SwapImpactCard
          data={analytics.swap_impact.data}
          summary={analytics.swap_impact.summary}
        />
      </div>
    </div>
  );
}
