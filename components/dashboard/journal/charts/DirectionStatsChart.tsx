'use client';

import { useMemo } from 'react';
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import type { Trade } from '@/lib/journal/types';

interface Props { trades: Trade[]; }

interface DirStats {
    label: string;
    side: 'Buy' | 'Sell';
    count: number;
    won: number;
    pnl: number;
    winRate: number;
    avgPnl: number;
    color: string;
    bg: string;
}

export function DirectionStatsChart({ trades }: Props) {
    const stats = useMemo((): DirStats[] => {
        const closed = trades.filter((t) => t.status !== 'open');

        return (['Buy', 'Sell'] as const).map((side) => {
            const group = closed.filter((t) => t.side === side);
            const won = group.filter((t) => t.status === 'won').length;
            const pnl = group.reduce((s, t) => s + t.pnl, 0);
            const winRate = group.length > 0 ? (won / group.length) * 100 : 0;
            return {
                label: side === 'Buy' ? '▲ Long (Buy)' : '▼ Short (Sell)',
                side,
                count: group.length,
                won,
                pnl: parseFloat(pnl.toFixed(2)),
                winRate: parseFloat(winRate.toFixed(1)),
                avgPnl: group.length > 0 ? parseFloat((pnl / group.length).toFixed(2)) : 0,
                color: side === 'Buy' ? 'text-sky-500' : 'text-violet-500',
                bg: side === 'Buy' ? 'bg-sky-50 dark:bg-sky-900/20' : 'bg-violet-50 dark:bg-violet-900/20',
            };
        });
    }, [trades]);

    const Stat = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-gray-400">{label}</span>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-50">{value}</span>
            {sub && <span className="text-xs text-gray-400">{sub}</span>}
        </div>
    );

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-md dark:border dark:border-gray-700/50">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-0.5">Short vs Long</h3>
            <p className="text-xs text-gray-400 mb-4">Win rate y P&L separado por dirección</p>

            <div className="grid grid-cols-2 gap-4">
                {stats.map((s) => (
                    <div key={s.side} className={`rounded-2xl ${s.bg} p-4`}>
                        <div className={`mb-3 flex items-center gap-2 font-semibold text-sm ${s.color}`}>
                            {s.side === 'Buy'
                                ? <TrendingUpIcon className="h-4 w-4" />
                                : <TrendingDownIcon className="h-4 w-4" />}
                            {s.label}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Stat label="Trades" value={String(s.count)} />
                            <Stat
                                label="Win Rate"
                                value={`${s.winRate.toFixed(0)}%`}
                                sub={`${s.won}/${s.count}`}
                            />
                            <Stat
                                label="P&L Total"
                                value={`${s.pnl >= 0 ? '+' : ''}$${s.pnl.toFixed(0)}`}
                            />
                            <Stat
                                label="P&L Prom."
                                value={`${s.avgPnl >= 0 ? '+' : ''}$${s.avgPnl.toFixed(0)}`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
