'use client';

import { useMemo } from 'react';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Cell, ReferenceLine,
} from 'recharts';
import type { Trade } from '@/lib/journal/types';

interface Props { trades: Trade[]; }

export function SymbolPerformanceChart({ trades }: Props) {
    const data = useMemo(() => {
        const bySymbol: Record<string, number> = {};
        for (const t of trades) {
            if (t.status === 'open') continue;
            bySymbol[t.symbol] = (bySymbol[t.symbol] ?? 0) + t.pnl;
        }
        return Object.entries(bySymbol)
            .map(([symbol, pnl]) => ({ symbol, pnl: parseFloat(pnl.toFixed(2)) }))
            .sort((a, b) => b.pnl - a.pnl)
            .slice(0, 10);
    }, [trades]);

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-md dark:border dark:border-gray-700/50">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-0.5">Performance por Símbolo</h3>
            <p className="text-xs text-gray-400 mb-4">Top 10 activos por P&L acumulado</p>
            {data.length === 0 ? (
                <div className="flex h-48 items-center justify-center text-xs text-gray-400">Sin datos</div>
            ) : (
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-gray-100 dark:stroke-gray-700" />
                            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} className="fill-gray-400"
                                tickFormatter={(v) => `${v >= 0 ? '+' : ''}$${v.toFixed(0)}`} />
                            <YAxis type="category" dataKey="symbol" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} className="fill-gray-600 dark:fill-gray-300" width={52} />
                            <Tooltip
                                contentStyle={{ borderRadius: '0.75rem', border: '1px solid rgba(0,0,0,0.06)', fontSize: '0.75rem' }}
                                formatter={(v: number) => [`${v >= 0 ? '+' : ''}$${v.toFixed(2)}`, 'P&L']}
                            />
                            <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={1} />
                            <Bar dataKey="pnl" radius={[0, 4, 4, 0]} maxBarSize={22}>
                                {data.map((d, i) => (
                                    <Cell key={i} fill={d.pnl >= 0 ? '#22c55e' : '#ef4444'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
