'use client';

import { useMemo } from 'react';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Cell, ReferenceLine,
} from 'recharts';
import type { Trade } from '@/lib/journal/types';
import { getEffectivePnl } from '@/lib/journal/storage';

interface Props { trades: Trade[]; initialCapital: number; }

export function SymbolPerformanceChart({ trades, initialCapital }: Props) {
    const data = useMemo(() => {
        const bySymbol: Record<string, number> = {};
        for (const t of trades) {
            if (t.status === 'open') continue;
            const val = getEffectivePnl(t, initialCapital);
            bySymbol[t.symbol] = (bySymbol[t.symbol] ?? 0) + val;
        }
        return Object.entries(bySymbol)
            .map(([symbol, pnl]) => ({ symbol, pnl: parseFloat(pnl.toFixed(2)) }))
            .sort((a, b) => b.pnl - a.pnl)
            .slice(0, 10);
    }, [trades, initialCapital]);

    if (data.length === 0) return null;

    return (
        <div className="overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all duration-300 hover:shadow-xl">
            <div className="border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 px-6 py-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50 tracking-tight">Performance por Símbolo</h3>
                <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Top 10 activos más rentables</p>
            </div>

            <div className="p-6">
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                        >
                            <defs>
                                <linearGradient id="barGradientPos" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#059669" stopOpacity={1} />
                                </linearGradient>
                                <linearGradient id="barGradientNeg" x1="1" y1="0" x2="0" y2="0">
                                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#dc2626" stopOpacity={1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="4 4" horizontal={false} className="stroke-gray-100 dark:stroke-gray-800" opacity={0.4} />
                            <XAxis
                                type="number"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                tickFormatter={(v) => `${v >= 0 ? '+' : ''}${v}`}
                            />
                            <YAxis
                                type="category"
                                dataKey="symbol"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fontWeight: 800, fill: 'currentColor' }}
                                className="text-gray-600 dark:text-gray-300"
                                width={60}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        const val = payload[0].value as number;
                                        return (
                                            <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 p-3 shadow-2xl backdrop-blur-md">
                                                <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">{label}</p>
                                                <p className={`text-lg font-black ${val >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                    {val >= 0 ? '+' : ''}{val.toLocaleString()} P&L
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={1} strokeOpacity={0.5} />
                            <Bar
                                dataKey="pnl"
                                radius={[0, 6, 6, 0]}
                                maxBarSize={30}
                                animationDuration={1000}
                                animationEasing="ease-out"
                            >
                                {data.map((d, i) => (
                                    <Cell key={i} fill={d.pnl >= 0 ? 'url(#barGradientPos)' : 'url(#barGradientNeg)'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
