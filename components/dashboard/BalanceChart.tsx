'use client';

import { useState } from 'react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import type { BalancePoint } from '@/data/dashboard/tradingData';

export function BalanceChart({
    weeklyData,
    monthlyData,
}: {
    weeklyData: BalancePoint[];
    monthlyData: BalancePoint[];
}) {
    const [view, setView] = useState<'weekly' | 'monthly'>('weekly');
    const data = view === 'weekly' ? weeklyData : monthlyData;

    const latestBalance = data[data.length - 1]?.balance ?? 0;

    return (
        <div className="rounded-xl bg-white p-6 shadow-md transition-colors dark:border dark:border-gray-700/50 dark:bg-gray-800 dark:shadow-none">
            {/* Header */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-50">
                        Portfolio Overview
                    </h2>
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                        ${latestBalance.toLocaleString()}
                    </div>
                </div>

                {/* View toggle */}
                <div className="inline-flex h-9 items-center rounded-full bg-gray-100 p-1 dark:bg-gray-700">
                    <button
                        onClick={() => setView('weekly')}
                        className={`rounded-full px-4 py-1.5 text-xs font-medium cursor-pointer transition-colors ${view === 'weekly'
                            ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-gray-50'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        Weekly
                    </button>
                    <button
                        onClick={() => setView('monthly')}
                        className={`rounded-full px-4 py-1.5 text-xs font-medium cursor-pointer transition-colors ${view === 'monthly'
                            ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-gray-50'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        Monthly
                    </button>
                </div>
            </div>

            {/* Legend */}
            <div className="mb-4 flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Balance</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-secondary-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Equity</span>
                </div>
            </div>

            {/* Chart */}
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3461FF" stopOpacity={0.2} />
                                <stop offset="100%" stopColor="#3461FF" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            className="stroke-gray-200 dark:stroke-gray-700"
                        />
                        <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12 }}
                            className="fill-gray-500 dark:fill-gray-400"
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12 }}
                            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                            className="fill-gray-500 dark:fill-gray-400"
                            width={55}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '0.75rem',
                                border: '1px solid rgba(0,0,0,0.06)',
                                boxShadow: '0 4px 12px -1px rgba(0,0,0,0.12)',
                                fontSize: '0.75rem',
                                backgroundColor: 'var(--tooltip-bg, #fff)',
                                color: 'var(--tooltip-text, #1f2937)',
                            }}
                            formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
                        />
                        <Area
                            type="monotone"
                            dataKey="balance"
                            name="Balance"
                            stroke="#3461FF"
                            strokeWidth={2.5}
                            fill="url(#balanceGradient)"
                            dot={false}
                            activeDot={{ r: 4, strokeWidth: 2 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="equity"
                            name="Equity"
                            stroke="#FF6B00"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
