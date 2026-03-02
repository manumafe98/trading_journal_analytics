'use client';

import { useMemo } from 'react';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Cell, ReferenceLine,
} from 'recharts';
import type { Trade } from '@/lib/journal/types';

interface Props { trades: Trade[]; }

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function DayOfWeekChart({ trades }: Props) {
    const data = useMemo(() => {
        const byDay: Record<number, { pnl: number; count: number }> = {};
        for (let i = 0; i < 7; i++) byDay[i] = { pnl: 0, count: 0 };
        for (const t of trades) {
            if (t.status === 'open' || !t.exitDate) continue;
            const day = new Date(t.exitDate + 'T12:00:00').getDay();
            byDay[day].pnl += t.pnl;
            byDay[day].count++;
        }
        return Object.entries(byDay).map(([d, v]) => ({
            day: DAYS[parseInt(d)],
            pnl: parseFloat(v.pnl.toFixed(2)),
            count: v.count,
        }));
    }, [trades]);

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-md dark:border dark:border-gray-700/50">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-0.5">P&L por Día</h3>
            <p className="text-xs text-gray-400 mb-4">Resultado acumulado por día de la semana</p>
            <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-700" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} className="fill-gray-400" />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} className="fill-gray-400" width={45}
                            tickFormatter={(v) => `$${v >= 0 ? '' : '-'}${Math.abs(v).toFixed(0)}`} />
                        <Tooltip
                            contentStyle={{ borderRadius: '0.75rem', border: '1px solid rgba(0,0,0,0.06)', fontSize: '0.75rem' }}
                            formatter={(v: number, _: string, p) => [
                                `${v >= 0 ? '+' : ''}$${v.toFixed(2)} (${(p.payload as { count: number }).count} trades)`,
                                'P&L',
                            ]}
                        />
                        <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1} />
                        <Bar dataKey="pnl" radius={[6, 6, 0, 0]} maxBarSize={40}>
                            {data.map((d, i) => (
                                <Cell key={i} fill={d.pnl >= 0 ? '#22c55e' : '#ef4444'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
