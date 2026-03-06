'use client';

import { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';
import type { Trade } from '@/lib/journal/types';
import { getEffectivePnl } from '@/lib/journal/storage';

interface Props {
    trades: Trade[];
    categoryKey: keyof Trade;
    title: string;
    description?: string;
    initialCapital: number;
    // Formatter is optional, mostly used if keys need translation
    labelFormatter?: (value: string) => string;
}

export function CategoryStatsChart({ trades, categoryKey, title, description, initialCapital, labelFormatter }: Props) {
    const data = useMemo(() => {
        const closedTrades = trades.filter((t) => t.status !== 'open');
        const statsMap = new Map<string, { count: number; wins: number; lost: number; be: number; pnl: number }>();

        closedTrades.forEach((t) => {
            const val = t[categoryKey];
            let catStr = val == null || val === '' ? 'Sin Dato' : String(val);

            if (catStr.length > 25) {
                catStr = catStr.substring(0, 22) + '...';
            }

            if (!statsMap.has(catStr)) {
                statsMap.set(catStr, { count: 0, wins: 0, lost: 0, be: 0, pnl: 0 });
            }

            const current = statsMap.get(catStr)!;
            current.count++;
            if (t.status === 'won') current.wins++;
            else if (t.status === 'lost') current.lost++;
            else if (t.status === 'be') current.be++;
            current.pnl += getEffectivePnl(t, initialCapital);
        });

        return Array.from(statsMap.entries()).map(([name, stats]) => {
            const winRate = (stats.wins / (stats.wins + stats.lost || 1)) * 100;
            return {
                name: labelFormatter && name !== 'Sin Dato' ? labelFormatter(name) : name,
                count: stats.count,
                won: stats.wins,
                lost: stats.lost,
                be: stats.be,
                winRate: Number(winRate.toFixed(1)),
                pnl: Number(stats.pnl.toFixed(2)),
            };
        }).sort((a, b) => b.count - a.count).slice(0, 10);
    }, [trades, categoryKey, labelFormatter, initialCapital]);

    if (data.length === 0 || (data.length === 1 && data[0].name === 'Sin Dato')) return null;

    return (
        <div className="group overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-900/30">
            <div className="border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 px-6 py-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50 tracking-tight">{title}</h3>
                {description && (
                    <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{description}</p>
                )}
            </div>

            <div className="p-6">
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }} barGap={0}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-gray-100 dark:text-gray-800" opacity={0.3} />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                width={80}
                                className="text-[10px] font-bold text-gray-500 uppercase"
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const d = payload[0].payload;
                                        return (
                                            <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 p-3 shadow-2xl backdrop-blur-md">
                                                <p className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">{d.name}</p>
                                                <div className="space-y-1.5 text-xs">
                                                    <div className="flex justify-between gap-6">
                                                        <span className="text-gray-400 font-medium">Resultados:</span>
                                                        <span className="font-bold flex gap-1">
                                                            <span className="text-emerald-500">{d.won}W</span> /
                                                            <span className="text-red-500">{d.lost}L</span> /
                                                            <span className="text-gray-400">{d.be}BE</span>
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between gap-6">
                                                        <span className="text-gray-400 font-medium">Win Rate:</span>
                                                        <span className="font-bold text-indigo-500">{d.winRate}%</span>
                                                    </div>
                                                    <div className="flex justify-between gap-6 border-t border-gray-100 dark:border-gray-700 pt-1">
                                                        <span className="text-gray-400 font-medium">PnL Total:</span>
                                                        <span className={`font-black ${d.pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                            {d.pnl >= 0 ? '+' : ''}{d.pnl.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="won" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={20} />
                            <Bar dataKey="be" stackId="a" fill="#94a3b8" radius={[0, 0, 0, 0]} barSize={20} />
                            <Bar dataKey="lost" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 flex justify-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Win</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                        <span className="text-[9px] font-bold text-gray-400 uppercase">BE</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Loss</span>
                    </div>
                </div>
            </div>
        </div>
    );
}


