'use client';

import { useMemo } from 'react';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Cell, ReferenceLine,
} from 'recharts';
import type { Trade } from '@/lib/journal/types';

interface Props { trades: Trade[]; }

// Assign hour to a time-of-day bucket for color coding
function hourToColor(h: number): string {
    if (h >= 2 && h < 9) return '#f59e0b'; // Asia / pre-market
    if (h >= 9 && h < 13) return '#3b82f6'; // London / NY open
    if (h >= 13 && h < 17) return '#22c55e'; // NY session
    return '#8b5cf6'; // after hours / overnight
}

export function SessionChart({ trades }: Props) {
    const data = useMemo(() => {
        // Group closed trades by entry hour
        const closed = trades.filter((t) => t.status !== 'open' && t.entryTime);
        const byHour: Record<number, { pnl: number; won: number; total: number }> = {};

        for (const t of closed) {
            const hour = parseInt((t.entryTime ?? '00:00').split(':')[0], 10);
            if (!byHour[hour]) byHour[hour] = { pnl: 0, won: 0, total: 0 };
            byHour[hour].pnl += t.pnl;
            byHour[hour].total += 1;
            if (t.status === 'won') byHour[hour].won += 1;
        }

        return Object.entries(byHour)
            .map(([h, v]) => ({
                hour: parseInt(h, 10),
                label: `${h.padStart(2, '0')}:00`,
                pnl: parseFloat(v.pnl.toFixed(2)),
                winRate: v.total > 0 ? Math.round((v.won / v.total) * 100) : 0,
                count: v.total,
                color: hourToColor(parseInt(h, 10)),
            }))
            .sort((a, b) => a.hour - b.hour);
    }, [trades]);

    const hasData = data.length > 0;

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-md dark:border dark:border-gray-700/50">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-0.5">Rendimiento por Hora</h3>
            <p className="text-xs text-gray-400 mb-4">P&L acumulado — por hora de entrada del trade</p>

            {!hasData ? (
                <div className="flex h-44 flex-col items-center justify-center text-xs text-gray-400 gap-1">
                    <span>Sin datos de hora disponibles</span>
                    <span className="opacity-60">Completá la columna &ldquo;Hora Ejecución&rdquo; en la tabla</span>
                </div>
            ) : (
                <>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-700" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} className="fill-gray-400" />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} className="fill-gray-400" width={50}
                                    tickFormatter={(v) => `${v >= 0 ? '+' : ''}$${Math.abs(v).toFixed(0)}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '0.75rem', border: '1px solid rgba(0,0,0,0.06)', fontSize: '0.75rem' }}
                                    formatter={(v: number, _: string, p) => [
                                        `${v >= 0 ? '+' : ''}$${v.toFixed(2)} · ${(p.payload as { winRate: number; count: number }).winRate}% WR · ${(p.payload as { winRate: number; count: number }).count} trades`,
                                        'P&L',
                                    ]}
                                    labelFormatter={(l) => `Hora ${l}`}
                                />
                                <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1} />
                                <Bar dataKey="pnl" radius={[6, 6, 0, 0]} maxBarSize={40}>
                                    {data.map((d, i) => (
                                        <Cell key={i} fill={d.pnl >= 0 ? d.color : '#ef4444'} opacity={0.85} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Session legend */}
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                        {[
                            { label: 'Asia (02-08)', color: '#f59e0b' },
                            { label: 'Londres / Apertura (09-12)', color: '#3b82f6' },
                            { label: 'Nueva York (13-16)', color: '#22c55e' },
                            { label: 'Fuera de sesión', color: '#8b5cf6' },
                        ].map(({ label, color }) => (
                            <div key={label} className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                                {label}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
