'use client';

import { useMemo } from 'react';
import {
    ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis,
    CartesianGrid, Tooltip, ReferenceLine, ZAxis,
} from 'recharts';
import type { Trade } from '@/lib/journal/types';

interface Props { trades: Trade[]; }

export function RiskRewardScatter({ trades }: Props) {
    const data = useMemo(() => {
        return trades
            .filter((t) => t.status !== 'open' && t.stopLoss && t.entryPrice)
            .map((t) => {
                const risk = Math.abs(t.entryPrice - t.stopLoss!);
                const reward = Math.abs(t.pnl / t.quantity);
                const rr = risk > 0 ? reward / risk : 0;
                return {
                    rr: parseFloat(rr.toFixed(2)),
                    pnl: parseFloat(t.pnl.toFixed(2)),
                    symbol: t.symbol,
                    isWin: t.status === 'won',
                };
            });
    }, [trades]);

    // Fallback: use pnlPercent if no SL set
    const fallbackData = useMemo(() => {
        if (data.length > 0) return [];
        return trades
            .filter((t) => t.status !== 'open')
            .map((t, i) => ({
                x: i + 1,
                pnl: parseFloat(t.pnl.toFixed(2)),
                symbol: t.symbol,
                isWin: t.status === 'won',
            }));
    }, [trades, data]);

    const hasRRData = data.length > 0;

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-md dark:border dark:border-gray-700/50">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-0.5">Risk / Reward</h3>
            <p className="text-xs text-gray-400 mb-4">
                {hasRRData
                    ? 'Ratio R:R vs resultado — requiere Stop Loss cargado'
                    : 'P&L por trade (cargá Stop Loss para ver R:R)'}
            </p>
            {trades.filter((t) => t.status !== 'open').length === 0 ? (
                <div className="flex h-44 items-center justify-center text-xs text-gray-400">Sin trades cerrados</div>
            ) : (
                <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-700" />
                            <XAxis
                                type="number"
                                dataKey={hasRRData ? 'rr' : 'x'}
                                name={hasRRData ? 'R:R Ratio' : 'Trade #'}
                                axisLine={false} tickLine={false} tick={{ fontSize: 11 }} className="fill-gray-400"
                                label={hasRRData ? { value: 'R:R', position: 'insideBottomRight', offset: -5, fontSize: 10 } : undefined}
                            />
                            <YAxis type="number" dataKey="pnl" name="P&L" axisLine={false} tickLine={false}
                                tick={{ fontSize: 11 }} className="fill-gray-400" width={52}
                                tickFormatter={(v) => `$${v >= 0 ? '' : '-'}${Math.abs(v).toFixed(0)}`} />
                            <ZAxis range={[40, 40]} />
                            <Tooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                contentStyle={{ borderRadius: '0.75rem', border: '1px solid rgba(0,0,0,0.06)', fontSize: '0.75rem' }}
                                content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null;
                                    const d = payload[0].payload;
                                    return (
                                        <div className="rounded-xl border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700 p-3 text-xs shadow-lg">
                                            <p className="font-semibold text-gray-800 dark:text-gray-200">{d.symbol}</p>
                                            {hasRRData && <p className="text-gray-500">R:R {d.rr}</p>}
                                            <p className={d.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                                                P&L: {d.pnl >= 0 ? '+' : ''}${d.pnl}
                                            </p>
                                        </div>
                                    );
                                }}
                            />
                            <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 4" />
                            <Scatter
                                data={hasRRData ? data : fallbackData}
                                fill="#3b82f6"
                                shape={(props: { cx?: number; cy?: number; payload?: { isWin: boolean } }) => {
                                    const { cx = 0, cy = 0, payload } = props;
                                    const color = payload?.isWin ? '#22c55e' : '#ef4444';
                                    return <circle cx={cx} cy={cy} r={5} fill={color} fillOpacity={0.75} stroke={color} strokeWidth={1.5} />;
                                }}
                            />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
