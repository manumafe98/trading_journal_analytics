'use client';

import { useMemo } from 'react';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Cell, ReferenceLine,
} from 'recharts';
import type { Trade } from '@/lib/journal/types';

interface Props { trades: Trade[]; }

export function PLDistributionChart({ trades }: Props) {
    const data = useMemo(() => {
        const closed = trades.filter((t) => t.status !== 'open' && t.pnl !== 0);
        if (closed.length === 0) return [];
        const pnls = closed.map((t) => t.pnl);
        const min = Math.min(...pnls);
        const max = Math.max(...pnls);
        const buckets = 8;
        const step = (max - min) / buckets || 1;
        const bins: { label: string; count: number; isPositive: boolean }[] = Array.from({ length: buckets }, (_, i) => {
            const lo = min + i * step;
            const hi = lo + step;
            return {
                label: `${lo >= 0 ? '+' : ''}${lo.toFixed(0)}`,
                count: 0,
                isPositive: (lo + hi) / 2 >= 0,
            };
        });
        for (const p of pnls) {
            const idx = Math.min(Math.floor((p - min) / step), buckets - 1);
            bins[idx].count++;
        }
        return bins;
    }, [trades]);

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-md dark:border dark:border-gray-700/50">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-0.5">Distribución de P&L</h3>
            <p className="text-xs text-gray-400 mb-4">Frecuencia de ganancias y pérdidas</p>
            {data.length === 0 ? (
                <div className="flex h-44 items-center justify-center text-xs text-gray-400">Sin trades cerrados</div>
            ) : (
                <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-700" />
                            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} className="fill-gray-400" />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} className="fill-gray-400" width={30} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: '0.75rem', border: '1px solid rgba(0,0,0,0.06)', fontSize: '0.75rem' }}
                                formatter={(v: number) => [v, 'Trades']}
                            />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
                                {data.map((d, i) => (
                                    <Cell key={i} fill={d.isPositive ? '#22c55e' : '#ef4444'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
