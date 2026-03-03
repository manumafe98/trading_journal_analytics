'use client';

import { useMemo } from 'react';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, Cell,
} from 'recharts';
import type { Trade } from '@/lib/journal/types';

interface Props { trades: Trade[]; }

// Parse human-readable duration strings like "2h30m", "45min", "1h", "30m", "1d"
// Returns minutes, or null if unparseable
function parseDuration(text: string): number | null {
    if (!text) return null;
    const t = text.toLowerCase().trim();
    let total = 0;
    const days = t.match(/(\d+(?:\.\d+)?)\s*d/);
    const hours = t.match(/(\d+(?:\.\d+)?)\s*h/);
    const mins = t.match(/(\d+(?:\.\d+)?)\s*m(?!o)/); // 'm' not followed by 'o' (avoid 'month')
    if (days) total += parseFloat(days[1]) * 24 * 60;
    if (hours) total += parseFloat(hours[1]) * 60;
    if (mins) total += parseFloat(mins[1]);
    // If just a bare number, assume minutes
    if (!days && !hours && !mins) {
        const bare = parseFloat(t);
        if (!isNaN(bare)) total = bare;
    }
    return total > 0 ? total : null;
}

function bucketLabel(minutes: number): string {
    if (minutes < 30) return '< 30m';
    if (minutes < 120) return '30m–2h';
    if (minutes < 480) return '2h–8h';
    if (minutes < 1440) return '8h–1d';
    return '> 1d';
}

const BUCKET_ORDER = ['< 30m', '30m–2h', '2h–8h', '8h–1d', '> 1d'];

export function DurationChart({ trades }: Props) {
    const data = useMemo(() => {
        // Gather trades with durationText filled
        const withDuration = trades.filter(
            (t) => t.status !== 'open' && t.durationText,
        );

        const buckets: Record<string, { wins: number; losses: number; pnl: number; count: number }> = {};
        for (const label of BUCKET_ORDER) {
            buckets[label] = { wins: 0, losses: 0, pnl: 0, count: 0 };
        }

        for (const t of withDuration) {
            const mins = parseDuration(t.durationText ?? '');
            if (mins === null) continue;
            const b = bucketLabel(mins);
            buckets[b].count += 1;
            buckets[b].pnl += t.pnl;
            if (t.status === 'won') buckets[b].wins += 1;
            else buckets[b].losses += 1;
        }

        return BUCKET_ORDER
            .map((label) => ({
                label,
                wins: buckets[label].wins,
                losses: buckets[label].losses,
                pnl: parseFloat(buckets[label].pnl.toFixed(2)),
                count: buckets[label].count,
                winRate: buckets[label].count > 0
                    ? Math.round((buckets[label].wins / buckets[label].count) * 100)
                    : 0,
            }))
            .filter((d) => d.count > 0);
    }, [trades]);

    const hasData = data.length > 0;

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-md dark:border dark:border-gray-700/50">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-0.5">Duración vs Resultado</h3>
            <p className="text-xs text-gray-400 mb-4">Ganadores y perdedores agrupados por duración del trade</p>

            {!hasData ? (
                <div className="flex h-44 flex-col items-center justify-center text-xs text-gray-400 gap-1">
                    <span>Sin suficientes datos</span>
                    <span className="opacity-60">Completá la columna &ldquo;Duración&rdquo; (ej: 2h30m, 45m, 1d)</span>
                </div>
            ) : (
                <>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-700" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} className="fill-gray-400" />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} className="fill-gray-400" width={28}
                                    allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '0.75rem', border: '1px solid rgba(0,0,0,0.06)', fontSize: '0.75rem' }}
                                    formatter={(v: number, name: string) => [v, name === 'wins' ? 'Ganados' : 'Perdidos']}
                                    labelFormatter={(l) => `${l} · ${data.find((d) => d.label === l)?.winRate ?? 0}% WR`}
                                />
                                <Legend formatter={(v) => v === 'wins' ? 'Ganados' : 'Perdidos'} iconType="circle" iconSize={8}
                                    wrapperStyle={{ fontSize: '0.7rem', paddingTop: '8px' }} />
                                <Bar dataKey="wins" name="wins" stackId="a" radius={[0, 0, 0, 0]} fill="#22c55e" opacity={0.85} />
                                <Bar dataKey="losses" name="losses" stackId="a" radius={[6, 6, 0, 0]} fill="#ef4444" opacity={0.8} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Summary pills */}
                    <div className="mt-3 flex flex-wrap gap-2">
                        {data.map((d) => (
                            <div key={d.label} className="flex items-center gap-1.5 rounded-lg bg-gray-50 dark:bg-gray-700/40 px-3 py-1.5">
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{d.label}</span>
                                <span className="text-xs text-gray-400">{d.winRate}% WR · {d.count} trades</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
