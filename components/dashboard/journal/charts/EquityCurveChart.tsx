'use client';

import { useMemo } from 'react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';
import type { Trade } from '@/lib/journal/types';
import { getEffectivePnl } from '@/lib/journal/storage';

interface Props { trades: Trade[]; initialCapital: number; }

export function EquityCurveChart({ trades, initialCapital }: Props) {
    const data = useMemo(() => {
        const closed = trades
            .filter((t) => t.status !== 'open' && t.entryDate)
            .sort((a, b) => {
                const da = new Date(a.exitDate || a.entryDate).getTime();
                const db = new Date(b.exitDate || b.entryDate).getTime();
                if (da !== db) return da - db;
                // Stable sort fallback: by ID
                return a.id.localeCompare(b.id);
            });

        let running = initialCapital;
        const points = [{ date: 'Inicio', equity: initialCapital, pnl: 0, tradeCount: 0 }];
        closed.forEach((t, i) => {
            const pnl = getEffectivePnl(t, initialCapital);
            running += pnl;
            points.push({
                date: t.exitDate || t.entryDate,
                equity: parseFloat(running.toFixed(2)),
                pnl: parseFloat(pnl.toFixed(2)),
                tradeCount: i + 1
            });
        });
        return points;
    }, [trades, initialCapital]);

    const min = Math.min(...data.map((d) => d.equity));
    const max = Math.max(...data.map((d) => d.equity));
    const finalEquity = data[data.length - 1]?.equity || initialCapital;
    const isProfit = finalEquity >= initialCapital;

    if (data.length <= 1) return null;

    return (
        <div className="overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all duration-300 hover:shadow-xl">
            <div className="border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 px-6 py-4 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50 tracking-tight">Curva de Equity</h3>
                    <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Crecimiento real del capital</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isProfit ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-red-50 text-red-600 dark:bg-red-500/10'}`}>
                    {((finalEquity / initialCapital - 1) * 100).toFixed(2)}% ROI
                </div>
            </div>

            <div className="p-6">
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={isProfit ? '#10b981' : '#ef4444'} stopOpacity={0.25} />
                                    <stop offset="100%" stopColor={isProfit ? '#10b981' : '#ef4444'} stopOpacity={0.01} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="currentColor" className="text-gray-100 dark:text-gray-800" opacity={0.4} />
                            <XAxis
                                dataKey="tradeCount"
                                axisLine={false}
                                tickLine={false}
                                className="text-[10px] font-bold text-gray-400"
                                interval="preserveStartEnd"
                                tickFormatter={(tick) => {
                                    const d = data.find(x => x.tradeCount === tick);
                                    if (!d || d.date === 'Inicio') return '';
                                    return new Date(d.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
                                }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                className="text-[10px] font-bold text-gray-400"
                                domain={[min * 0.99, max * 1.01]}
                                tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
                            />
                            <Tooltip
                                cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const d = payload[0].payload;
                                        return (
                                            <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 p-4 shadow-2xl backdrop-blur-md min-w-[160px]">
                                                <p className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">{d.date === 'Inicio' ? 'Inception' : d.date}</p>
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-500 uppercase">Capital Total</p>
                                                        <p className="text-xl font-black text-gray-900 dark:text-gray-50 leading-tight">${d.equity.toLocaleString()}</p>
                                                    </div>
                                                    {d.pnl !== 0 && (
                                                        <div className="border-t border-gray-50 dark:border-gray-800 pt-2 flex justify-between items-center">
                                                            <span className="text-[10px] font-bold text-gray-400">P&L Trade:</span>
                                                            <span className={`text-xs font-black ${d.pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{d.pnl >= 0 ? '+' : ''}{d.pnl}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <ReferenceLine y={initialCapital} stroke="#94a3b8" strokeDasharray="6 6" strokeOpacity={0.3} />
                            <Area
                                type="monotone"
                                dataKey="equity"
                                stroke={isProfit ? '#10b981' : '#ef4444'}
                                strokeWidth={4}
                                fill="url(#equityFill)"
                                animationDuration={2000}
                                animationEasing="ease-in-out"
                                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#6366f1' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
