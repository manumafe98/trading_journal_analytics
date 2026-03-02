'use client';

import { useMemo } from 'react';
import type { Trade } from '@/lib/journal/types';

interface Props { trades: Trade[]; }

interface KPI {
    label: string;
    value: string;
    sub?: string;
    color?: string;
}

export function RRStatsCard({ trades }: Props) {
    const stats = useMemo(() => {
        const closed = trades.filter(
            (t) => t.status !== 'open' && t.rrObtained !== undefined && t.rrObtained !== null,
        );
        const winners = closed.filter((t) => t.status === 'won');
        const losers = closed.filter((t) => t.status === 'lost');

        const avg = (arr: Trade[]) =>
            arr.length > 0
                ? arr.reduce((s, t) => s + (t.rrObtained ?? 0), 0) / arr.length
                : null;

        const all = avg(closed);
        const win = avg(winners);
        const loss = avg(losers);

        // Best & worst single RR
        const best = closed.reduce<number | null>((m, t) => {
            const v = t.rrObtained ?? 0;
            return m === null || v > m ? v : m;
        }, null);
        const worst = closed.reduce<number | null>((m, t) => {
            const v = t.rrObtained ?? 0;
            return m === null || v < m ? v : m;
        }, null);

        return { all, win, loss, best, worst, count: closed.length };
    }, [trades]);

    const kpis: KPI[] = [
        {
            label: 'RR Promedio',
            value: stats.all !== null ? stats.all.toFixed(2) : '—',
            sub: `${stats.count} trades con RR`,
        },
        {
            label: 'RR Ganadores',
            value: stats.win !== null ? stats.win.toFixed(2) : '—',
            color: 'text-green-500',
        },
        {
            label: 'RR Perdedores',
            value: stats.loss !== null ? stats.loss.toFixed(2) : '—',
            color: 'text-red-400',
        },
        {
            label: 'Mejor RR',
            value: stats.best !== null ? stats.best.toFixed(2) : '—',
            color: 'text-sky-500',
        },
    ];

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-md dark:border dark:border-gray-700/50">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-0.5">RR Promedio</h3>
            <p className="text-xs text-gray-400 mb-4">Risk/Reward obtenido — ganadores vs perdedores</p>

            {stats.count === 0 ? (
                <div className="flex h-24 items-center justify-center text-xs text-gray-400 text-center">
                    Sin datos de RR. Cargá trades con el campo RR obtenido.
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                    {kpis.map((k) => (
                        <div key={k.label} className="rounded-xl bg-gray-50 dark:bg-gray-700/40 p-3">
                            <p className="text-xs text-gray-400 mb-1">{k.label}</p>
                            <p className={`text-2xl font-bold ${k.color ?? 'text-gray-900 dark:text-gray-50'}`}>
                                {k.value}
                            </p>
                            {k.sub && (
                                <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
