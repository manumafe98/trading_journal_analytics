'use client';

import { useMemo } from 'react';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ReferenceArea, ReferenceLine
} from 'recharts';
import type { Trade } from '@/lib/journal/types';

interface Props { trades: Trade[]; }

export function SessionChart({ trades }: Props) {
    const data = useMemo(() => {
        // Group by hour
        const hourly: Record<number, { hour: number, total: number, won: number, lost: number, be: number }> = {};
        for (let i = 0; i < 24; i++) {
            hourly[i] = { hour: i, total: 0, won: 0, lost: 0, be: 0 };
        }

        trades.forEach(t => {
            if (!t.entryTime) return;
            const hour = parseInt(t.entryTime.split(':')[0]);
            if (!isNaN(hour) && hourly[hour]) {
                hourly[hour].total++;
                if (t.status === 'won') hourly[hour].won++;
                else if (t.status === 'lost') hourly[hour].lost++;
                else if (t.status === 'be') hourly[hour].be++;
            }
        });

        return Object.values(hourly).map(h => ({
            ...h,
            timeLabel: `${h.hour}:00`,
            winRate: h.total > 0 ? (h.won / (h.won + h.lost || 1)) * 100 : 0
        }));
    }, [trades]);

    return (
        <div className="overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all duration-300 hover:shadow-xl">
            <div className="border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 px-6 py-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50 tracking-tight">Actividad por Horario</h3>
                <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                    Distribución de trades por hora (Basado en la hora ingresada)
                </p>
            </div>

            <div className="p-6">
                <div className="h-64 w-full mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} barGap={0}>
                            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="currentColor" className="text-gray-100 dark:text-gray-800" opacity={0.4} />

                            {/* Visual Session Highlights (Approximate UTC) */}
                            <ReferenceArea x1={3} x2={11} fill="#0ea5e9" fillOpacity={0.03} label={{ position: 'top', value: 'LDN', fontSize: 10, fill: '#0ea5e9', fontWeight: 'bold' }} />
                            <ReferenceArea x1={8} x2={16} fill="#f59e0b" fillOpacity={0.03} label={{ position: 'top', value: 'NY', fontSize: 10, fill: '#f59e0b', fontWeight: 'bold' }} />

                            <XAxis
                                dataKey="hour"
                                axisLine={false}
                                tickLine={false}
                                className="text-[10px] font-bold text-gray-400"
                                tickFormatter={(v) => `${v}h`}
                                interval={2}
                            />
                            <YAxis axisLine={false} tickLine={false} className="text-[10px] font-bold text-gray-400" />

                            <Tooltip
                                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        const d = payload[0].payload;
                                        return (
                                            <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 p-3 shadow-2xl backdrop-blur-md">
                                                <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">{label}:00 HS</p>
                                                <div className="space-y-1.5 text-xs">
                                                    <div className="flex justify-between gap-4">
                                                        <span className="text-gray-400 font-medium">Ganados:</span>
                                                        <span className="font-bold text-emerald-500">{d.won}</span>
                                                    </div>
                                                    <div className="flex justify-between gap-4">
                                                        <span className="text-gray-400 font-medium">Perdidos:</span>
                                                        <span className="font-bold text-red-500">{d.lost}</span>
                                                    </div>
                                                    <div className="flex justify-between gap-4 border-t border-gray-100 dark:border-gray-700 pt-1">
                                                        <span className="text-gray-400 font-medium">Win Rate:</span>
                                                        <span className="font-bold text-indigo-500">{d.winRate.toFixed(1)}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />

                            <Bar dataKey="won" stackId="hour" fill="#10b981" radius={[0, 0, 0, 0]} barSize={20} />
                            <Bar dataKey="be" stackId="hour" fill="#94a3b8" radius={[0, 0, 0, 0]} barSize={20} />
                            <Bar dataKey="lost" stackId="hour" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] font-bold uppercase text-gray-400">Won</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        <span className="text-[10px] font-bold uppercase text-gray-400">BE</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        <span className="text-[10px] font-bold uppercase text-gray-400">Lost</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
