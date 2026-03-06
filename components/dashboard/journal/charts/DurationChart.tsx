'use client';

import { useMemo } from 'react';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Cell,
} from 'recharts';
import type { Trade } from '@/lib/journal/types';

interface Props { trades: Trade[]; }

function parseDuration(text: string): number | null {
    if (!text) return null;
    const t = text.toLowerCase().trim();
    let total = 0;
    const days = t.match(/(\d+(?:\.\d+)?)\s*d/);
    const hours = t.match(/(\d+(?:\.\d+)?)\s*h/);
    const mins = t.match(/(\d+(?:\.\d+)?)\s*m(?!o)/);
    if (days) total += parseFloat(days[1]) * 24 * 60;
    if (hours) total += parseFloat(hours[1]) * 60;
    if (mins) total += parseFloat(mins[1]);
    if (!days && !hours && !mins) {
        const bare = parseFloat(t);
        if (!isNaN(bare)) total = bare;
    }
    return total > 0 ? total : null;
}

function bucketLabel(minutes: number): string {
    if (minutes < 30) return '< 30min';
    if (minutes < 120) return '30m-2h';
    if (minutes < 480) return '2h-8h';
    if (minutes < 1440) return 'Intradía';
    return '> 1 día';
}

const BUCKET_ORDER = ['< 30min', '30m-2h', '2h-8h', 'Intradía', '> 1 día'];

export function DurationChart({ trades }: Props) {
    const data = useMemo(() => {
        const withDuration = trades.filter(t => t.status !== 'open' && t.durationText);
        const buckets: Record<string, { wins: number; losses: number; count: number }> = {};
        BUCKET_ORDER.forEach(label => buckets[label] = { wins: 0, losses: 0, count: 0 });

        withDuration.forEach(t => {
            const mins = parseDuration(t.durationText ?? '');
            if (mins === null) return;
            const b = bucketLabel(mins);
            if (buckets[b]) {
                buckets[b].count++;
                if (t.status === 'won') buckets[b].wins++;
                else buckets[b].losses++;
            }
        });

        return BUCKET_ORDER.map(label => ({
            label,
            ...buckets[label],
            winRate: buckets[label].count > 0 ? (buckets[label].wins / buckets[label].count) * 100 : 0
        })).filter(d => d.count > 0);
    }, [trades]);

    if (data.length === 0) return null;

    return (
        <div className="overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all duration-300 hover:shadow-xl">
            <div className="border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 px-6 py-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50 tracking-tight">Duración y Resultado</h3>
                <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Categorización por tiempo de permanencia</p>
            </div>

            <div className="p-6">
                <div className="h-48 w-full mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                            <defs>
                                <linearGradient id="winGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                                    <stop offset="100%" stopColor="#059669" stopOpacity={0.9} />
                                </linearGradient>
                                <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="currentColor" className="text-gray-100 dark:text-gray-800" opacity={0.4} />
                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                className="text-[10px] font-bold text-gray-400"
                            />
                            <YAxis axisLine={false} tickLine={false} className="text-[10px] font-bold text-gray-400" />
                            <Tooltip
                                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        const d = payload[0].payload;
                                        return (
                                            <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 p-3 shadow-2xl backdrop-blur-md">
                                                <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">{label}</p>
                                                <div className="space-y-1.5">
                                                    <div className="flex justify-between items-center gap-6">
                                                        <span className="text-[10px] font-bold text-emerald-500">WIN: {d.wins}</span>
                                                        <span className="text-[10px] font-bold text-red-500">LOSS: {d.losses}</span>
                                                    </div>
                                                    <p className="text-xs font-black text-gray-900 dark:text-gray-100 border-t border-gray-50 dark:border-gray-700 pt-1">
                                                        Win Rate: {d.winRate.toFixed(1)}%
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="wins" stackId="a" fill="url(#winGradient)" radius={[0, 0, 0, 0]} maxBarSize={30} />
                            <Bar dataKey="losses" stackId="a" fill="url(#lossGradient)" radius={[4, 4, 0, 0]} maxBarSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                    {data.map(d => (
                        <div key={d.label} className="bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-700/50 flex items-center gap-2">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-tight">{d.label}</span>
                            <span className={`text-[10px] font-black ${d.winRate >= 50 ? 'text-emerald-500' : 'text-amber-500'}`}>{d.winRate.toFixed(0)}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
