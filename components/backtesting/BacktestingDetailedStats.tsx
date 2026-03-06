'use client';

import { useMemo } from 'react';
import {
    TrendingUpIcon, TrendingDownIcon, TargetIcon,
    ZapIcon, BarChart3Icon, ScaleIcon
} from 'lucide-react';
import { CategoryStatsChart } from '@/components/dashboard/journal/charts/CategoryStatsChart';
import { SymbolPerformanceChart } from '@/components/dashboard/journal/charts/SymbolPerformanceChart';
import { SessionChart } from '@/components/dashboard/journal/charts/SessionChart';
import { DurationChart } from '@/components/dashboard/journal/charts/DurationChart';
import { RiskRewardScatter } from '@/components/dashboard/journal/charts/RiskRewardScatter';
import type { Trade, Account } from '@/lib/journal/types';
import { getEffectivePnl } from '@/lib/journal/storage';

interface Props {
    account: Account;
    trades: Trade[];
}

export function BacktestingDetailedStats({ account, trades }: Props) {
    const stats = useMemo(() => {
        const closed = trades.filter(t => t.status !== 'open');
        if (closed.length === 0) return null;

        const wins = closed.filter(t => t.status === 'won');
        const losses = closed.filter(t => t.status === 'lost');

        const totalPnl = closed.reduce((acc, t) => acc + getEffectivePnl(t, account.initialCapital), 0);
        const winPnl = wins.reduce((acc, t) => acc + getEffectivePnl(t, account.initialCapital), 0);
        const lossPnl = Math.abs(losses.reduce((acc, t) => acc + getEffectivePnl(t, account.initialCapital), 0));

        const profitFactor = lossPnl === 0 ? (winPnl > 0 ? 100 : 0) : winPnl / lossPnl;
        const expectancy = closed.length > 0 ? totalPnl / closed.length : 0;

        const rrTrades = closed.filter(t => t.rrObtained != null);
        const avgRR = rrTrades.length > 0 ? rrTrades.reduce((acc, t) => acc + t.rrObtained!, 0) / rrTrades.length : 0;

        return {
            totalPnl,
            profitFactor,
            expectancy,
            avgRR,
            winRate: (wins.length / (wins.length + losses.length || 1)) * 100
        };
    }, [trades, account.initialCapital]);

    if (trades.length === 0) {
        return (
            <div className="mx-auto max-w-[1600px] px-4 py-24 text-center md:px-6 lg:px-8 flex flex-col items-center">
                <div className="h-16 w-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                    📊
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sin datos suficientes</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mt-2">
                    Agregá trades simulados a esta cuenta de backtesting para desbloquear el análisis avanzado.
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-6 lg:px-8 space-y-12">
            {/* ── Section Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-gray-50 tracking-tight">Análisis Avanzado</h2>
                    <p className="mt-1 text-sm font-medium text-gray-500">
                        Métricas de rendimiento institucional para validar tu ventaja en el mercado.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    {trades.length} Trades Analizados
                </div>
            </div>

            {/* ── Summary Stats Grid ── */}
            {stats && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard
                        title="Profit Factor"
                        value={stats.profitFactor.toFixed(2)}
                        icon={<ScaleIcon className="h-4 w-4" />}
                        description="Retorno por cada $1 perdido"
                        color="indigo"
                    />
                    <SummaryCard
                        title="Expectativa"
                        value={`${stats.expectancy >= 0 ? '+' : ''}${stats.expectancy.toFixed(stats.expectancy < 10 ? 2 : 0)}`}
                        icon={<ZapIcon className="h-4 w-4" />}
                        description="PnL promedio por trade"
                        color="amber"
                    />
                    <SummaryCard
                        title="R:R Promedio"
                        value={`${stats.avgRR.toFixed(2)}R`}
                        icon={<TargetIcon className="h-4 w-4" />}
                        description="Ratio riesgo/beneficio realizado"
                        color="emerald"
                    />
                    <SummaryCard
                        title="Win Rate"
                        value={`${stats.winRate.toFixed(1)}%`}
                        description="Excluye Breakeven (BE)"
                        icon={<BarChart3Icon className="h-4 w-4" />}
                        color={stats.winRate >= 50 ? 'emerald' : 'amber'}
                    />
                </div>
            )}

            {/* ── Principales Performance Charts ── */}
            <div className="grid gap-6 lg:grid-cols-2">
                <SymbolPerformanceChart trades={trades} initialCapital={account.initialCapital} />
                <RiskRewardScatter trades={trades} />
            </div>

            {/* ── Cronología y Tiempo ── */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">Tiempo y Duración</h3>
                <div className="grid gap-6 md:grid-cols-2">
                    <SessionChart trades={trades} />
                    <DurationChart trades={trades} />
                </div>
            </div>

            {/* ── Variables de Contexto y Setup ── */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">Contexto y Ejecución</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <CategoryStatsChart
                        trades={trades}
                        categoryKey="strategy"
                        title="Setup / Estrategia"
                        description="Rendimiento de cada setup operado"
                        initialCapital={account.initialCapital}
                    />
                    <CategoryStatsChart
                        trades={trades}
                        categoryKey="htfDirection"
                        title="Dirección HTF"
                        description="Contexto de temporalidad mayor"
                        initialCapital={account.initialCapital}
                    />
                    <CategoryStatsChart
                        trades={trades}
                        categoryKey="ltfDirection"
                        title="Dirección LTF"
                        description="Confirmación en temporalidad menor"
                        initialCapital={account.initialCapital}
                    />
                    <CategoryStatsChart
                        trades={trades}
                        categoryKey="pullback"
                        title="Nivel de Pullback"
                        description="Profunidad del retroceso"
                        initialCapital={account.initialCapital}
                    />
                    <CategoryStatsChart
                        trades={trades}
                        categoryKey="entryType"
                        title="Tipo de Entrada"
                        description="Gatillo específico de entrada"
                        initialCapital={account.initialCapital}
                    />
                    <CategoryStatsChart
                        trades={trades}
                        categoryKey="executable"
                        title="Ejecutable"
                        description="Rendimiento según ventana horaria / sesión"
                        initialCapital={account.initialCapital}
                    />
                </div>
            </div>

            {/* ── Gestión y Psicología ── */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">Análisis de Gestión</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <CategoryStatsChart
                        trades={trades}
                        categoryKey="management"
                        title="Gestión Aplicada"
                        description="Cómo manejaste la posición abierta"
                        initialCapital={account.initialCapital}
                    />
                    <CategoryStatsChart
                        trades={trades}
                        categoryKey="correctManagement"
                        title="Gestión Correcta"
                        description="¿Se aplicó el plan de gestión?"
                        initialCapital={account.initialCapital}
                    />
                    <CategoryStatsChart
                        trades={trades}
                        categoryKey="againstChecklist"
                        title="En contra / Chequear"
                        description="Factores en contra que ignoraste"
                        initialCapital={account.initialCapital}
                    />
                    <CategoryStatsChart
                        trades={trades}
                        categoryKey="errorNotes"
                        title="Análisis de Errores"
                        description="Categorización de fallas operativas"
                        initialCapital={account.initialCapital}
                    />
                    <CategoryStatsChart
                        trades={trades}
                        categoryKey="howContinued"
                        title="¿Cómo siguió?"
                        description="Comportamiento del precio post-salida"
                        initialCapital={account.initialCapital}
                    />
                    <CategoryStatsChart
                        trades={trades}
                        categoryKey="wouldReenter"
                        title="¿Volvería a entrar?"
                        description="Convicción retrospectiva"
                        initialCapital={account.initialCapital}
                    />
                </div>
            </div>

            {/* ── Extras ── */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">Otras Variables</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <CategoryStatsChart
                        trades={trades}
                        categoryKey="proud"
                        title="Satisfacción (Orgulloso)"
                        description="Calidad subjetiva de la ejecución"
                        initialCapital={account.initialCapital}
                    />
                    <CategoryStatsChart
                        trades={trades}
                        categoryKey="style"
                        title="Estilo de Operación"
                        description="Swing, Day o Scalp"
                        initialCapital={account.initialCapital}
                    />
                    <CategoryStatsChart
                        trades={trades}
                        categoryKey="targetMax"
                        title="Potencial de Target"
                        description="Zonas de salida máxima"
                        initialCapital={account.initialCapital}
                    />
                </div>
            </div>
        </div>
    );
}

function SummaryCard({ title, value, icon, description, color }: {
    title: string;
    value: string;
    icon: React.ReactNode;
    description: string;
    color: 'indigo' | 'emerald' | 'amber' | 'rose';
}) {
    const colors = {
        indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30',
        emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30',
        amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30',
        rose: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30',
    };

    return (
        <div className={`rounded-3xl border p-5 transition-all hover:shadow-lg ${colors[color]}`}>
            <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{title}</span>
                <div className="rounded-xl p-2 bg-white/50 dark:bg-gray-800/40 shadow-sm">{icon}</div>
            </div>
            <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tight">{value}</span>
                <span className="text-[10px] font-bold mt-1 opacity-60 uppercase">{description}</span>
            </div>
        </div>
    );
}

