'use client';

import { useMemo } from 'react';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Cell, LabelList,
} from 'recharts';
import type { Trade } from '@/lib/journal/types';

interface Props { trades: Trade[]; }

function daysBetween(a: string, b: string | null): number | null {
    if (!b) return null;
    const msA = new Date(a).getTime();
    const msB = new Date(b).getTime();
    if (isNaN(msA) || isNaN(msB)) return null;
    return Math.round(Math.abs(msB - msA) / (1000 * 60 * 60 * 24));
}

export function DurationChart({ trades }: Props) {
    const { byOutcome, byStyle } = useMemo(() => {
        const closed = trades.filter(
            (t) => t.status !== 'open' && t.exitDate,
        );

        const avg = (arr: Trade[]) => {
            const vals = arr
                .map((t) => daysBetween(t.entryDate, t.exitDate))
                .filter((v): v is number => v !== null);
            return vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : null;
        };

        const winners = avg(closed.filter((t) => t.status === 'won'));
        const losers = avg(closed.filter((t) => t.status === 'lost'));

        const byOutcome = [
            { label: 'Ganadores', days: winners !== null ? parseFloat(winners.toFixed(1)) : 0, color: '#22c55e' },
            { label: 'Perdedores', days: losers !== null ? parseFloat(losers.toFixed(1)) : 0, color: '#ef4444' },
        ];

        const styles = ['DAY', 'SWING', 'SCALP'] as const;
        const byStyle = styles.map((s) => {
            const group = closed.filter((t) => t.style === s);
            const avgDays = avg(group);
            return {
                style: s,
                days: avgDays !== null ? parseFloat(avgDays.toFixed(1)) : 0,
                count: group.length,
            };
        }).filter((d) => d.count > 0);

        return { byOutcome, byStyle };
    }, [trades]);

    const hasData = byOutcome.some((d) => d.days > 0);

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-md dark:border dark:border-gray-700/50">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-0.5">Duración Promedio</h3>
            <p className="text-xs text-gray-400 mb-4">Días promedio — ganadores vs perdedores</p>

            {!hasData ? (
                <div className="flex h-40 items-center justify-center text-xs text-gray-400">Sin suficientes datos</div>
            ) : (
                <>
                    <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={byOutcome} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-700" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} className="fill-gray-400" />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} className="fill-gray-400" width={38}
                                    tickFormatter={(v) => `${v}d`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '0.75rem', border: '1px solid rgba(0,0,0,0.06)', fontSize: '0.75rem' }}
                                    formatter={(v: number) => [`${v} días`, 'Duración prom.']}
                                />
                                <Bar dataKey="days" radius={[8, 8, 0, 0]} maxBarSize={64}>
                                    <LabelList dataKey="days" position="top" formatter={(v: number) => `${v}d`} style={{ fontSize: 12, fill: '#9ca3af' }} />
                                    {byOutcome.map((d, i) => (
                                        <Cell key={i} fill={d.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* By style */}
                    {byStyle.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-3">
                            {byStyle.map((d) => (
                                <div key={d.style} className="flex items-center gap-1.5 rounded-lg bg-gray-50 dark:bg-gray-700/40 px-3 py-1.5">
                                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{d.style}</span>
                                    <span className="text-xs text-gray-400">· {d.days}d avg · {d.count} trades</span>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
