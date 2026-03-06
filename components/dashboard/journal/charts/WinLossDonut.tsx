'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { Trade } from '@/lib/journal/types';

interface Props { trades: Trade[]; }

export function WinLossDonut({ trades }: Props) {
    const { data, winRate, won, lost, be } = useMemo(() => {
        const closed = trades.filter((t) => t.status !== 'open');
        const wonCount = closed.filter((t) => t.status === 'won').length;
        const lostCount = closed.filter((t) => t.status === 'lost').length;
        const beCount = closed.filter((t) => t.status === 'be').length;

        // Match storage.ts formula: wins / (wins + losses)
        const relevant = wonCount + lostCount;
        const wr = relevant > 0 ? (wonCount / relevant) * 100 : 0;

        return {
            data: [
                { name: 'Ganadas', value: wonCount, color: '#10b981' },
                { name: 'Perdidas', value: lostCount, color: '#ef4444' },
                { name: 'Breakeven', value: beCount, color: '#f59e0b' },
            ].filter(d => d.value > 0),
            winRate: wr,
            won: wonCount,
            lost: lostCount,
            be: beCount
        };
    }, [trades]);

    if (won + lost + be === 0) return null;

    return (
        <div className="overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all duration-300 hover:shadow-xl">
            <div className="border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 px-6 py-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50 tracking-tight">Efectividad General</h3>
                <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Distribución Victoria / Derrota</p>
            </div>

            <div className="p-6">
                <div className="relative h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <defs>
                                <linearGradient id="wonPie" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                                    <stop offset="100%" stopColor="#059669" stopOpacity={1} />
                                </linearGradient>
                                <linearGradient id="lossPie" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#dc2626" stopOpacity={1} />
                                </linearGradient>
                            </defs>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={80}
                                dataKey="value"
                                paddingAngle={6}
                                startAngle={90}
                                endAngle={-270}
                                animationBegin={0}
                                animationDuration={1500}
                                stroke="none"
                            >
                                {data.map((entry, i) => {
                                    const fill = entry.name === 'Ganadas' ? 'url(#wonPie)'
                                        : entry.name === 'Perdidas' ? 'url(#lossPie)'
                                            : '#f59e0b'; // BE color
                                    return <Cell key={i} fill={fill} />;
                                })}
                            </Pie>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const d = payload[0].payload;
                                        return (
                                            <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 p-3 shadow-2xl backdrop-blur-md">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{d.name}</p>
                                                </div>
                                                <p className="text-sm font-black text-gray-900 dark:text-gray-100">{d.value} Trades</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className={`text-2xl font-black tracking-tighter ${winRate >= 50 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {winRate.toFixed(0)}%
                        </span>
                        <span className="text-[8px] font-black uppercase text-gray-400 tracking-[0.2em]">Win Rate</span>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100/50 dark:border-emerald-500/10 text-center">
                        <p className="text-[8px] font-black text-emerald-600/60 uppercase tracking-widest mb-0.5">Won</p>
                        <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 leading-none">{won}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-red-50/50 dark:bg-red-500/5 border border-red-100/50 dark:border-red-500/10 text-center">
                        <p className="text-[8px] font-black text-red-600/60 uppercase tracking-widest mb-0.5">Lost</p>
                        <p className="text-sm font-black text-red-600 dark:text-red-400 leading-none">{lost}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100/50 dark:border-amber-500/10 text-center">
                        <p className="text-[8px] font-black text-amber-600/60 uppercase tracking-widest mb-0.5">BE</p>
                        <p className="text-sm font-black text-amber-600 dark:text-amber-400 leading-none">{be}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
