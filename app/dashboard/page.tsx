'use client';

import {
  AccountSummarySection,
  PnlChartCard,
  EquityChartCard,
  TradingObjectivesGrid,
  ControlBar,
} from '@/components/dashboard';

export default function DashboardPage() {
  return (
    <>
      {/* Control Bar */}
      <ControlBar />

      {/* Account Summary */}
      <AccountSummarySection />

      {/* Main KPI Charts */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <PnlChartCard className="lg:col-span-5" />
        <EquityChartCard className="lg:col-span-7" />
      </div>

      {/* Trading Objectives */}
      <div className="mt-6">
        <TradingObjectivesGrid />
      </div>
    </>
  );
}
