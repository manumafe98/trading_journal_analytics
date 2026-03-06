'use client';

import { useMemo } from 'react';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Cell, ReferenceLine,
} from 'recharts';
import type { Trade } from '@/lib/journal/types';
import { getEffectivePnl } from '@/lib/journal/storage';

interface Props { trades: Trade[]; initialCapital: number; }

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export function MonthlyPLChart({ trades, initialCapital }: Props) {
    const data = useMemo(() => {
        const byMonth: Record<string, number> = {};
        for (const t of trades) {
            if (t.status === 'open' || !t.exitDate) continue;
            const d = new Date(t.exitDate);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            byMonth[key] = (byMonth[key] ?? 0) + getEffectivePnl(t, initialCapital);
        }
        return Object.entries(byMonth)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, pnl]) => {
                const [year, month] = key.split('-');
                return { month: `${MONTH_LABELS[parseInt(month) - 1]} ${year.slice(2)}`, pnl: parseFloat(pnl.toFixed(2)) };
            });
    }, [trades]);

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-md dark:border dark:border-gray-700/50">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-0.5">P&L Mensual</h3>
            <p className="text-xs text-gray-400 mb-4">Ganancias y pérdidas por mes</p>
            {data.length === 0 ? (
                <div className="flex h-44 items-center justify-center text-xs text-gray-400">Sin datos</div>
            ) : (
                <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-700" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} className="fill-gray-400" />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v >= 0 ? '' : '-'}${Math.abs(v / 1000).toFixed(0)}k`} className="fill-gray-400" width={45} />
                            <Tooltip
                                contentStyle={{ borderRadius: '0.75rem', border: '1px solid rgba(0,0,0,0.06)', fontSize: '0.75rem' }}
                                formatter={(v: number) => [`${v >= 0 ? '+' : ''}$${v.toFixed(2)}`, 'P&L']}
                            />
                            <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1} />
                            <Bar dataKey="pnl" radius={[6, 6, 0, 0]} maxBarSize={48}>
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
