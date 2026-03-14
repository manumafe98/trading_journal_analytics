'use client';

import { useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from 'lucide-react';
import { tradeHistory, DashboardTradeDirection, TradeStatus, type Trade } from '@/data/dashboard/sampleData';

const ITEMS_PER_PAGE = 5;

export function TradingHistoryTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(tradeHistory.length / ITEMS_PER_PAGE);
  const pageData = tradeHistory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-50">
        Trading History
      </h3>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-colors dark:border-gray-800 dark:bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Trade ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Symbol
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Direction
                </th>
                <th className="hidden px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 md:table-cell">
                  Entry
                </th>
                <th className="hidden px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 md:table-cell">
                  Exit
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                  P&L
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 lg:table-cell">
                  Date
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 lg:table-cell">
                  R:R
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((trade) => (
                <TradeRow key={trade.id} trade={trade} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-800">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, tradeHistory.length)} of{' '}
            {tradeHistory.length}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <ChevronLeftIcon className="h-3.5 w-3.5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-xs font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-gray-950'
                    : 'border border-gray-200 text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <ChevronRightIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function TradeRow({ trade }: { trade: Trade }) {
  const { pnlPercent, id, symbol, direction, entryPrice, exitPrice, pnl, date, riskReward, status } = trade;
  const isPositive = pnlPercent >= 0;

  return (
    <tr className="border-b border-gray-100 transition-colors last:border-b-0 hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-gray-800/30">
      <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
        {id}
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-50">
        {symbol}
      </td>
      <td className="px-4 py-3">
        <DirectionBadge direction={direction} />
      </td>
      <td className="hidden px-4 py-3 text-right text-sm tabular-nums text-gray-600 dark:text-gray-400 md:table-cell">
        ${entryPrice}
      </td>
      <td className="hidden px-4 py-3 text-right text-sm tabular-nums text-gray-600 dark:text-gray-400 md:table-cell">
        {exitPrice === '—' ? '—' : `$${exitPrice}`}
      </td>
      <td className="px-4 py-3 text-right">
        <span
          className={`text-sm font-semibold tabular-nums ${
            isPositive ? 'text-primary' : 'text-accent-negative'
          }`}
        >
          {pnl}
        </span>
        <span
          className={`ml-1 text-xs tabular-nums ${
            isPositive ? 'text-primary/70' : 'text-accent-negative/70'
          }`}
        >
          ({isPositive ? '+' : ''}{pnlPercent}%)
        </span>
      </td>
      <td className="hidden px-4 py-3 text-sm text-gray-500 dark:text-gray-400 lg:table-cell">
        {date}
      </td>
      <td className="hidden px-4 py-3 text-sm tabular-nums text-gray-500 dark:text-gray-400 lg:table-cell">
        {riskReward}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={status} />
      </td>
    </tr>
  );
}

function DirectionBadge({ direction }: { direction: DashboardTradeDirection }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        direction === DashboardTradeDirection.Long
          ? 'bg-primary/10 text-primary'
          : 'bg-accent-negative/10 text-accent-negative'
      }`}
    >
      {direction === DashboardTradeDirection.Long ? (
        <ArrowUpIcon className="h-3 w-3" />
      ) : (
        <ArrowDownIcon className="h-3 w-3" />
      )}
      {direction === DashboardTradeDirection.Long ? 'Long' : 'Short'}
    </span>
  );
}

function StatusBadge({ status }: { status: TradeStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        status === TradeStatus.Open
          ? 'bg-secondary/10 text-secondary border border-secondary/20'
          : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === TradeStatus.Open ? 'bg-secondary animate-pulse' : 'bg-gray-400 dark:bg-gray-600'
        }`}
      />
      {status === TradeStatus.Open ? 'Open' : 'Closed'}
    </span>
  );
}
