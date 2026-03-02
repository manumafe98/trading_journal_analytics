'use client';

import { useMemo } from 'react';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Cell, ReferenceLine,
} from 'recharts';
import type { Trade, TradeSession } from '@/lib/journal/types';

interface Props { trades: Trade[]; }

const SESSIONS: TradeSession[] = ['Asia', 'London', 'New York', 'Other'];
const SESSION_COLORS: Record<TradeSession, string> = {
    Asia: '#f59e0b',
    London: '#3b82f6',
    'New York': '#22c55e',
    Other: '#8b5cf6',
};

export function SessionChart({ trades }: Props) {
    const data = useMemo(() => {
        return SESSIONS.map((session) => {
            const sessionTrades = trades.filter(
                (t) => t.session === session && t.status !== 'open',
            );
            const pnl = sessionTrades.reduce((s, t) => s + t.pnl, 0);
            const won = sessionTrades.filter((t) => t.status === 'won').length;
            const winRate =
                sessionTrades.length > 0 ? (won / sessionTrades.length) * 100 : 0;
            return {
                session,
                pnl: parseFloat(pnl.toFixed(2)),
                count: sessionTrades.length,
                winRate: parseFloat(winRate.toFixed(0)),
                color: SESSION_COLORS[session],
            };
        });
    }, [trades]);

    const hasSessions = data.some((d) => d.count > 0);

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-md dark:border dark:border-gray-700/50">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-0.5">Rendimiento por Sesión</h3>
            <p className="text-xs text-gray-400 mb-4">P&L acumulado — Asia / Londres / Nueva York</p>

            {!hasSessions ? (
                <div className="flex h-44 flex-col items-center justify-center text-xs text-gray-400 gap-1">
                    <span>Sin datos de sesión</span>
                    <span className="opacity-60">Cargá trades desde PDF para ver esta estadística</span>
                </div>
            ) : (
                <>
                    <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-700" />
                                <XAxis dataKey="session" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} className="fill-gray-400" />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} className="fill-gray-400" width={50}
                                    tickFormatter={(v) => `$${v >= 0 ? '' : '-'}${Math.abs(v).toFixed(0)}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '0.75rem', border: '1px solid rgba(0,0,0,0.06)', fontSize: '0.75rem' }}
                                    formatter={(v: number, _: string, p) => [
                                        `${v >= 0 ? '+' : ''}$${v.toFixed(2)} (${(p.payload as { count: number; winRate: number }).winRate}% WR, ${(p.payload as { count: number; winRate: number }).count} trades)`,
                                        'P&L',
                                    ]}
                                />
                                <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1} />
                                <Bar dataKey="pnl" radius={[6, 6, 0, 0]} maxBarSize={52}>
                                    {data.map((d, i) => (
                                        <Cell key={i} fill={d.pnl >= 0 ? d.color : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Legend */}
                    <div className="mt-3 flex flex-wrap gap-3">
                        {data.filter((d) => d.count > 0).map((d) => (
                            <div key={d.session} className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {d.session} ({d.count} trades)
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
