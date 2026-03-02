'use client';

import { useState } from 'react';
import { MenuIcon } from 'lucide-react';
import { ThemeSwitch } from '@/components/shared/ThemeSwitch';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { BalanceChart } from '@/components/dashboard/BalanceChart';
import { TradesTable } from '@/components/dashboard/TradesTable';
import {
  summaryCards,
  weeklyBalance,
  monthlyBalance,
  recentTrades,
} from '@/data/dashboard/tradingData';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gray-50 transition-colors dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <DashboardSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-6 md:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Top bar */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open sidebar menu"
                  className="cursor-pointer rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-800 lg:hidden"
                >
                  <MenuIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 md:text-3xl">
                  Dashboard
                </h1>
              </div>
              <ThemeSwitch />
            </div>

            {/* Summary cards grid */}
            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {summaryCards.map((card) => (
                <SummaryCard key={card.id} {...card} />
              ))}
            </div>

            {/* Chart (spans full width) */}
            <div className="mb-6">
              <BalanceChart
                weeklyData={weeklyBalance}
                monthlyData={monthlyBalance}
              />
            </div>

            {/* Trades table */}
            <TradesTable trades={recentTrades} />
          </div>
        </main>
      </div>
    </div>
  );
}
