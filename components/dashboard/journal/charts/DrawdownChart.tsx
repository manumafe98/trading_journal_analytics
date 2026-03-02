'use client';

import { useMemo } from 'react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';
import type { Trade } from '@/lib/journal/types';

interface Props { trades: Trade[]; initialCapital: number; }

export function DrawdownChart({ trades, initialCapital }: Props) {
    const data = useMemo(() => {
        const closed = trades
            .filter((t) => t.status !== 'open' && t.exitDate)
            .sort((a, b) => new Date(a.exitDate!).getTime() - new Date(b.exitDate!).getTime());

        let running = initialCapital;
        let peak = initialCapital;
        const points: { date: string; drawdown: number }[] = [{ date: 'Inicio', drawdown: 0 }];

        for (const t of closed) {
            running += t.pnl;
            if (running > peak) peak = running;
            const dd = peak > 0 ? ((running - peak) / peak) * 100 : 0;
            points.push({ date: t.exitDate!, drawdown: parseFloat(dd.toFixed(2)) });
        }
        return points;
    }, [trades, initialCapital]);

    const minDD = Math.min(...data.map((d) => d.drawdown));

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-md dark:border dark:border-gray-700/50">
            <div className="mb-1 flex items-start justify-between">
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-50">Drawdown</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Caída desde el pico máximo</p>
                </div>
                <span className="rounded-lg bg-red-50 dark:bg-red-900/20 px-2.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400">
                    Máx: {minDD.toFixed(2)}%
                </span>
            </div>
            <div className="h-48 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-700" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} className="fill-gray-400" interval="preserveStartEnd" />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} className="fill-gray-400" width={45} />
                        <Tooltip
                            contentStyle={{ borderRadius: '0.75rem', border: '1px solid rgba(0,0,0,0.06)', fontSize: '0.75rem' }}
                            formatter={(v: number) => [`${v.toFixed(2)}%`, 'Drawdown']}
                        />
                        <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1} />
                        <Area type="monotone" dataKey="drawdown" stroke="#ef4444" strokeWidth={2} fill="url(#ddGrad)" dot={false} activeDot={{ r: 4 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            {data.length <= 1 && (
                <p className="text-center text-xs text-gray-400 mt-2">Cargá trades para ver el drawdown</p>
            )}
        </div>
    );
}
