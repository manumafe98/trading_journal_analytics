'use client';

import { useMemo } from 'react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';
import type { Trade } from '@/lib/journal/types';

interface Props { trades: Trade[]; initialCapital: number; }

export function EquityCurveChart({ trades, initialCapital }: Props) {
    const data = useMemo(() => {
        const closed = trades
            .filter((t) => t.status !== 'open' && t.exitDate)
            .sort((a, b) => new Date(a.exitDate!).getTime() - new Date(b.exitDate!).getTime());

        let running = initialCapital;
        const points = [{ date: 'Inicio', equity: initialCapital, pnl: 0 }];
        for (const t of closed) {
            running += t.pnl;
            points.push({
                date: t.exitDate!,
                equity: running,
                pnl: t.pnl,
            });
        }
        return points;
    }, [trades, initialCapital]);

    const min = Math.min(...data.map((d) => d.equity));
    const max = Math.max(...data.map((d) => d.equity));
    const isProfit = data[data.length - 1]?.equity >= initialCapital;

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-md dark:border dark:border-gray-700/50">
            <div className="mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">Equity Curve</h3>
                <p className="text-xs text-gray-400 mt-0.5">Evolución del capital en el tiempo</p>
            </div>
            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={isProfit ? '#22c55e' : '#ef4444'} stopOpacity={0.25} />
                                <stop offset="100%" stopColor={isProfit ? '#22c55e' : '#ef4444'} stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-700" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} className="fill-gray-400" interval="preserveStartEnd" />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} className="fill-gray-400" width={52} domain={[min * 0.98, max * 1.02]} />
                        <Tooltip
                            contentStyle={{ borderRadius: '0.75rem', border: '1px solid rgba(0,0,0,0.06)', fontSize: '0.75rem', backgroundColor: 'var(--tw-prose-bg, white)' }}
                            formatter={(v: number) => [`$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Equity']}
                        />
                        <ReferenceLine y={initialCapital} stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1} />
                        <Area type="monotone" dataKey="equity" stroke={isProfit ? '#22c55e' : '#ef4444'} strokeWidth={2.5} fill="url(#eqGrad)" dot={false} activeDot={{ r: 4 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            {data.length <= 1 && (
                <p className="text-center text-xs text-gray-400 mt-2">Cargá trades para ver la curva de equity</p>
            )}
        </div>
    );
}
