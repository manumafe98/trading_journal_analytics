'use client';

import { useMemo } from 'react';
import {
    ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis,
    CartesianGrid, Tooltip, ReferenceLine, ZAxis, Cell,
    BarChart, Bar, ComposedChart, Line
} from 'recharts';
import type { Trade } from '@/lib/journal/types';

interface Props { trades: Trade[]; }

export function RiskRewardScatter({ trades }: Props) {
    const closedTrades = useMemo(() => trades.filter(t => t.status !== 'open'), [trades]);

    // Data for Scatter: Realized RR vs Pnl % (if available) or raw pnl
    const scatterData = useMemo(() => {
        return closedTrades.map((t) => ({
            x: t.rrObtained ?? 0,
            y: t.pnlPercent !== 0 ? t.pnlPercent : t.pnl,
            symbol: t.symbol,
            isWin: t.status === 'won',
            isBE: t.status === 'be',
            id: t.id,
            // Add slight jitter to avoid perfect overlap
            z: Math.random() * 10
        }));
    }, [closedTrades]);

    // Data for Histogram: Distribution of RR
    const histogramData = useMemo(() => {
        const bins: Record<string, { bin: string, count: number, pnl: number }> = {};
        const step = 0.5;

        closedTrades.forEach(t => {
            if (t.rrObtained == null) return;
            const binVal = Math.floor(t.rrObtained / step) * step;
            const binKey = `${binVal.toFixed(1)}R`;
            if (!bins[binKey]) bins[binKey] = { bin: binKey, count: 0, pnl: 0 };
            bins[binKey].count++;
            bins[binKey].pnl += (t.pnlPercent !== 0 ? t.pnlPercent : t.pnl);
        });

        return Object.values(bins).sort((a, b) => parseFloat(a.bin) - parseFloat(b.bin));
    }, [closedTrades]);

    if (closedTrades.length === 0) return null;

    return (
        <div className="grid gap-6">
            {/* ── RR Distribution Histogram ── */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all duration-300 hover:shadow-xl">
                <div className="border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50 tracking-tight">Distribución de R:R Realizado</h3>
                        <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">¿Qué ratio de beneficio sueles alcanzar?</p>
                    </div>
                </div>
                <div className="p-6">
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={histogramData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="rrBarGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                                        <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.9} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="currentColor" className="text-gray-100 dark:text-gray-800" opacity={0.4} />
                                <XAxis
                                    dataKey="bin"
                                    axisLine={false}
                                    tickLine={false}
                                    className="text-[10px] font-bold text-gray-400"
                                />
                                <YAxis axisLine={false} tickLine={false} className="text-[10px] font-bold text-gray-400" />
                                <Tooltip
                                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const d = payload[0].payload;
                                            return (
                                                <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 p-3 shadow-2xl backdrop-blur-md">
                                                    <p className="text-[10px] font-bold text-indigo-500 mb-1 uppercase tracking-widest">{d.bin}</p>
                                                    <div className="space-y-1 text-xs">
                                                        <p className="font-bold text-gray-900 dark:text-gray-100">{d.count} Trades</p>
                                                        <p className={`${d.pnl >= 0 ? 'text-emerald-500' : 'text-red-500'} font-black text-sm`}>
                                                            {d.pnl >= 0 ? '+' : ''}{d.pnl.toFixed(2)}{tradeHasPercent(trades) ? '%' : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="count" fill="url(#rrBarGradient)" radius={[6, 6, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ── Risk vs Reward Scatter ── */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all duration-300 hover:shadow-xl">
                <div className="border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 px-6 py-4">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50 tracking-tight">Riesgo vs Recompensa (Scatter)</h3>
                    <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Relación entre el R:R obtenido y el P&L final</p>
                </div>

                <div className="p-6">
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="4 4" stroke="currentColor" className="text-gray-100 dark:text-gray-800" opacity={0.4} />
                                <XAxis
                                    type="number"
                                    dataKey="x"
                                    name="R:R"
                                    axisLine={false}
                                    tickLine={false}
                                    className="text-[10px] font-bold text-gray-400"
                                    tickFormatter={(v) => `${v}R`}
                                />
                                <YAxis
                                    type="number"
                                    dataKey="y"
                                    axisLine={false}
                                    tickLine={false}
                                    className="text-[10px] font-bold text-gray-400"
                                    tickFormatter={(v) => `${v >= 0 ? '+' : ''}${v}${tradeHasPercent(trades) ? '%' : ''}`}
                                />
                                <ZAxis type="number" dataKey="z" range={[50, 400]} />
                                <Tooltip
                                    cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const d = payload[0].payload;
                                            return (
                                                <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 p-3 shadow-2xl backdrop-blur-md">
                                                    <div className="flex items-center justify-between gap-4 mb-2 border-b border-gray-100 dark:border-gray-700 pb-1.5">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{d.symbol}</p>
                                                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md ${d.isWin ? 'bg-emerald-100 text-emerald-700' : d.isBE ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700'}`}>
                                                            {d.isWin ? 'WIN' : d.isBE ? 'BE' : 'LOSS'}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className={`text-lg font-black ${d.y >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                            {d.y >= 0 ? '+' : ''}{d.y.toLocaleString()}{tradeHasPercent(trades) ? '%' : ''}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-indigo-500">R:R Obtenido: {d.x.toFixed(2)}R</p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1} strokeOpacity={0.3} />
                                <Scatter data={scatterData}>
                                    {scatterData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.isWin ? '#10b981' : entry.isBE ? '#94a3b8' : '#ef4444'}
                                            fillOpacity={0.5}
                                            stroke={entry.isWin ? '#059669' : entry.isBE ? '#64748b' : '#dc2626'}
                                            strokeWidth={1.5}
                                        />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-6 flex justify-center gap-6">
                        <LegendItem color="bg-emerald-500" label="Wins" />
                        <LegendItem color="bg-gray-400" label="BE" />
                        <LegendItem color="bg-red-500" label="Losses" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function LegendItem({ color, label }: { color: string, label: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${color} shadow-sm`}></div>
            <span className="text-[10px] font-bold uppercase text-gray-400">{label}</span>
        </div>
    );
}

function tradeHasPercent(trades: Trade[]): boolean {
    return trades.some(t => t.pnlPercent !== 0);
}
