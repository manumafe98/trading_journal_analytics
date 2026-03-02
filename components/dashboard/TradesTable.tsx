'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import type { Trade } from '@/data/dashboard/tradingData';
import { StatsBadge } from './StatsBadge';

const ITEMS_PER_PAGE = 6;

export function TradesTable({ trades }: { trades: Trade[] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(trades.length / ITEMS_PER_PAGE);

    const paginated = trades.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    return (
        <div className="overflow-hidden rounded-xl bg-white shadow-md transition-all duration-200 dark:border dark:border-gray-700/50 dark:bg-gray-800 dark:shadow-none">
            {/* Table header row */}
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700/50">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                    Recent Trades
                </h2>
            </div>

            {/* Scrollable table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700/50">
                            <th className="px-6 pb-3 pt-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Trade ID
                            </th>
                            <th className="px-6 pb-3 pt-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Symbol
                            </th>
                            <th className="px-6 pb-3 pt-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Side
                            </th>
                            <th className="hidden px-6 pb-3 pt-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 md:table-cell">
                                Entry
                            </th>
                            <th className="hidden px-6 pb-3 pt-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 md:table-cell">
                                Exit
                            </th>
                            <th className="px-6 pb-3 pt-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                P&L
                            </th>
                            <th className="hidden px-6 pb-3 pt-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 lg:table-cell">
                                Date
                            </th>
                            <th className="px-6 pb-3 pt-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Result
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map((trade) => (
                            <tr
                                key={trade.id}
                                className="border-b border-gray-100 transition-colors last:border-b-0 hover:bg-gray-50 dark:border-gray-700/25 dark:hover:bg-gray-700/20"
                            >
                                <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    {trade.id}
                                </td>
                                <td className="whitespace-nowrap px-6 py-3 text-sm font-semibold text-gray-900 dark:text-gray-50">
                                    {trade.symbol}
                                </td>
                                <td className="whitespace-nowrap px-6 py-3 text-sm">
                                    <StatsBadge variant={trade.side === 'Buy' ? 'buy' : 'sell'} />
                                </td>
                                <td className="hidden whitespace-nowrap px-6 py-3 text-right text-sm text-gray-700 dark:text-gray-200 md:table-cell">
                                    ${trade.entryPrice.toFixed(2)}
                                </td>
                                <td className="hidden whitespace-nowrap px-6 py-3 text-right text-sm text-gray-700 dark:text-gray-200 md:table-cell">
                                    {trade.status === 'open' ? '—' : `$${trade.exitPrice.toFixed(2)}`}
                                </td>
                                <td className="whitespace-nowrap px-6 py-3 text-right text-sm">
                                    <span
                                        className={`font-semibold ${trade.pnl > 0
                                            ? 'text-accent-success'
                                            : trade.pnl < 0
                                                ? 'text-accent-danger'
                                                : 'text-gray-500 dark:text-gray-400'
                                            }`}
                                    >
                                        {trade.status === 'open'
                                            ? '—'
                                            : `${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toFixed(2)}`}
                                    </span>
                                    {trade.status !== 'open' && (
                                        <span
                                            className={`ml-1 text-xs ${trade.pnlPercent >= 0
                                                ? 'text-accent-success'
                                                : 'text-accent-danger'
                                                }`}
                                        >
                                            ({trade.pnlPercent >= 0 ? '+' : ''}
                                            {trade.pnlPercent.toFixed(2)}%)
                                        </span>
                                    )}
                                </td>
                                <td className="hidden whitespace-nowrap px-6 py-3 text-sm text-gray-600 dark:text-gray-300 lg:table-cell">
                                    {trade.date}
                                </td>
                                <td className="whitespace-nowrap px-6 py-3 text-sm">
                                    <StatsBadge variant={trade.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-700/50">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                    {Math.min(currentPage * ITEMS_PER_PAGE, trades.length)} of{' '}
                    {trades.length} trades
                </span>

                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-xs font-medium transition-colors ${currentPage === page
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                        <ChevronRightIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
