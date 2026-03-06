'use client';

import { useMemo } from 'react';
import { FlameIcon, SnowflakeIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import type { Trade } from '@/lib/journal/types';

interface Props { trades: Trade[]; }

interface StreakResult {
    currentWin: number;
    maxWin: number;
    currentLoss: number;
    maxLoss: number;
}

function computeStreaks(trades: Trade[]): StreakResult {
    const closed = trades
        .filter((t) => t.status !== 'open' && t.exitDate)
        .sort((a, b) => new Date(a.exitDate!).getTime() - new Date(b.exitDate!).getTime());

    let curWin = 0, maxWin = 0, curLoss = 0, maxLoss = 0;
    for (const t of closed) {
        if (t.status === 'won') {
            curWin++;
            curLoss = 0;
            maxWin = Math.max(maxWin, curWin);
        } else if (t.status === 'lost') {
            curLoss++;
            curWin = 0;
            maxLoss = Math.max(maxLoss, curLoss);
        } else {
            // BE or other: reset current streaks but don't count as a loss
            curWin = 0;
            curLoss = 0;
        }
    }
    return { currentWin: curWin, maxWin, currentLoss: curLoss, maxLoss };
}

export function StreakCards({ trades }: Props) {
    const streaks = useMemo(() => computeStreaks(trades), [trades]);

    const Card = ({
        icon: Icon, label, current, max, isWin
    }: {
        icon: React.ComponentType<{ className?: string }>;
        label: string;
        current: number;
        max: number;
        isWin: boolean;
    }) => (
        <div className={`rounded-2xl p-4 ${isWin ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${isWin ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                <Icon className="h-4 w-4" />
                {label}
            </div>
            <div className="flex items-end gap-4">
                <div className="pb-1">
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">{max}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Racha máxima</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-md dark:border dark:border-gray-700/50">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-0.5">Win / Loss Streak</h3>
            <p className="text-xs text-gray-400 mb-4">Racha actual e histórica máxima</p>

            <div className="grid grid-cols-2 gap-4">
                <Card icon={FlameIcon} label="Racha ganadora" current={streaks.currentWin} max={streaks.maxWin} isWin />
                <Card icon={SnowflakeIcon} label="Racha perdedora" current={streaks.currentLoss} max={streaks.maxLoss} isWin={false} />
            </div>

            {trades.filter((t) => t.status !== 'open').length === 0 && (
                <p className="mt-3 text-center text-xs text-gray-400">Sin trades cerrados</p>
            )}
        </div>
    );
}
