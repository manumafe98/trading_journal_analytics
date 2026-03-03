'use client';

import { useMemo } from 'react';
import {
    ResponsiveContainer, ComposedChart, Bar, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import type { Trade } from '@/lib/journal/types';

interface Props { trades: Trade[]; }

export function MonthlyProgressChart({ trades }: Props) {
    const data = useMemo(() => {
        const closed = trades.filter((t) => t.status !== 'open');
        const byMonth: Record<string, { pnl: number; won: number; total: number }> = {};

        for (const t of closed) {
            const d = new Date(t.entryDate);
            if (isNaN(d.getTime())) continue;
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            if (!byMonth[key]) byMonth[key] = { pnl: 0, won: 0, total: 0 };
            byMonth[key].pnl += t.pnl;
            byMonth[key].total += 1;
            if (t.status === 'won') byMonth[key].won += 1;
        }

        return Object.entries(byMonth)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, v]) => {
                const [year, month] = key.split('-');
                const label = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('es', {
                    month: 'short', year: '2-digit',
                });
                return {
                    label,
                    pnl: parseFloat(v.pnl.toFixed(2)),
                    winRate: v.total > 0 ? Math.round((v.won / v.total) * 100) : 0,
                    trades: v.total,
                };
            });
    }, [trades]);

    const hasData = data.length >= 1;

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-md dark:border dark:border-gray-700/50">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-0.5">Progreso Mensual</h3>
            <p className="text-xs text-gray-400 mb-4">P&L mensual + Win Rate — evolución y consistencia</p>

            {!hasData ? (
                <div className="flex h-44 items-center justify-center text-xs text-gray-400">
                    Sin suficientes datos
                </div>
            ) : (
                <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-700" />
                            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} className="fill-gray-400" />
                            {/* Left Y: P&L */}
                            <YAxis yAxisId="pnl" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} className="fill-gray-400"
                                width={55} tickFormatter={(v) => `$${v >= 0 ? '' : '-'}${Math.abs(v).toFixed(0)}`} />
                            {/* Right Y: Win Rate */}
                            <YAxis yAxisId="wr" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11 }}
                                className="fill-gray-400" width={36} domain={[0, 100]}
                                tickFormatter={(v) => `${v}%`} />
                            <Tooltip
                                contentStyle={{ borderRadius: '0.75rem', border: '1px solid rgba(0,0,0,0.06)', fontSize: '0.75rem' }}
                                formatter={(v: number, name: string) => {
                                    if (name === 'pnl') return [`${v >= 0 ? '+' : ''}$${v.toFixed(2)}`, 'P&L'];
                                    if (name === 'winRate') return [`${v}%`, 'Win Rate'];
                                    return [v, name];
                                }}
                                labelFormatter={(l) => {
                                    const d = data.find((x) => x.label === l);
                                    return `${l} · ${d?.trades ?? 0} trades`;
                                }}
                            />
                            <Legend formatter={(v) => v === 'pnl' ? 'P&L' : 'Win Rate %'} iconType="circle" iconSize={8}
                                wrapperStyle={{ fontSize: '0.7rem', paddingTop: '8px' }} />
                            <Bar yAxisId="pnl" dataKey="pnl" name="pnl" radius={[6, 6, 0, 0]} maxBarSize={52}
                                fill="#6366f1" opacity={0.85}
                                // Green for positive, red for negative
                                label={false}
                            />
                            <Line yAxisId="wr" dataKey="winRate" name="winRate" type="monotone"
                                stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: '#f59e0b' }}
                                activeDot={{ r: 6 }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
