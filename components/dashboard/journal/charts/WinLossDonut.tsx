'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Trade } from '@/lib/journal/types';

interface Props { trades: Trade[]; }

export function WinLossDonut({ trades }: Props) {
    const { data, winRate } = useMemo(() => {
        const closed = trades.filter((t) => t.status !== 'open');
        const won = closed.filter((t) => t.status === 'won').length;
        const lost = closed.filter((t) => t.status === 'lost').length;
        const wr = closed.length > 0 ? (won / closed.length) * 100 : 0;
        return {
            data: [
                { name: 'Ganadas', value: won, color: '#22c55e' },
                { name: 'Perdidas', value: lost, color: '#ef4444' },
            ],
            winRate: wr,
        };
    }, [trades]);

    const total = data.reduce((s, d) => s + d.value, 0);

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-md dark:border dark:border-gray-700/50">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-0.5">Win Rate</h3>
            <p className="text-xs text-gray-400 mb-4">Distribución de resultados</p>

            {total === 0 ? (
                <div className="flex h-40 items-center justify-center text-xs text-gray-400">Sin trades cerrados</div>
            ) : (
                <div className="relative">
                    <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data} cx="50%" cy="50%" innerRadius={52} outerRadius={76}
                                    dataKey="value" paddingAngle={3} startAngle={90} endAngle={-270}>
                                    {data.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v: number, n: string) => [`${v} trades`, n]}
                                    contentStyle={{ borderRadius: '0.75rem', border: '1px solid rgba(0,0,0,0.06)', fontSize: '0.75rem' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center label */}
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-2xl font-bold ${winRate >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                                {winRate.toFixed(0)}%
                            </span>
                            <span className="text-xs text-gray-400">win rate</span>
                        </div>
                    </div>
                    {/* Legend */}
                    <div className="flex justify-center gap-5 mt-2">
                        {data.map((d) => (
                            <div key={d.name} className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                                <span className="text-xs text-gray-500 dark:text-gray-400">{d.name} ({d.value})</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
