'use client';

import { useState, useMemo } from 'react';
import { TrashIcon, ChevronDownIcon, ChevronUpIcon, SearchIcon } from 'lucide-react';
import type { Trade, TradeSide, TradeStatus } from '@/lib/journal/types';

interface Props {
    trades: Trade[];
    onDelete: (id: string) => void;
}

export function TradeJournalTable({ trades, onDelete }: Props) {
    const [search, setSearch] = useState('');
    const [filterSide, setFilterSide] = useState<TradeSide | 'All'>('All');
    const [filterStatus, setFilterStatus] = useState<TradeStatus | 'All'>('All');
    const [sortKey, setSortKey] = useState<'date' | 'pnl' | 'symbol'>('date');
    const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');

    const sorted = useMemo(() => {
        return trades
            .filter((t) => {
                const matchSearch = t.symbol.toLowerCase().includes(search.toLowerCase()) ||
                    (t.notes ?? '').toLowerCase().includes(search.toLowerCase());
                const matchSide = filterSide === 'All' || t.side === filterSide;
                const matchStatus = filterStatus === 'All' || t.status === filterStatus;
                return matchSearch && matchSide && matchStatus;
            })
            .sort((a, b) => {
                let va: number | string, vb: number | string;
                if (sortKey === 'date') { va = a.entryDate; vb = b.entryDate; }
                else if (sortKey === 'pnl') { va = a.pnl; vb = b.pnl; }
                else { va = a.symbol; vb = b.symbol; }
                if (va < vb) return sortDir === 'asc' ? -1 : 1;
                if (va > vb) return sortDir === 'asc' ? 1 : -1;
                return 0;
            });
    }, [trades, search, filterSide, filterStatus, sortKey, sortDir]);

    const toggleSort = (key: typeof sortKey) => {
        if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        else { setSortKey(key); setSortDir('desc'); }
    };

    const SortIcon = ({ col }: { col: typeof sortKey }) =>
        sortKey === col
            ? sortDir === 'asc' ? <ChevronUpIcon className="h-3 w-3" /> : <ChevronDownIcon className="h-3 w-3" />
            : <ChevronDownIcon className="h-3 w-3 opacity-30" />;

    const selectCls = "rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors";

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-md dark:border dark:border-gray-700/50 overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 border-b border-gray-100 dark:border-gray-700 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 w-full sm:w-56">
                    <SearchIcon className="h-4 w-4 text-gray-400" />
                    <input
                        type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar símbolo..."
                        className="bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none w-full"
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <select value={filterSide} onChange={(e) => setFilterSide(e.target.value as TradeSide | 'All')} className={selectCls}>
                        <option value="All">Todos</option>
                        <option value="Buy">Buy</option>
                        <option value="Sell">Sell</option>
                    </select>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as TradeStatus | 'All')} className={selectCls}>
                        <option value="All">Todos</option>
                        <option value="won">Ganados</option>
                        <option value="lost">Perdidos</option>
                        <option value="open">Abiertos</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                            <th className="px-5 py-3 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none" onClick={() => toggleSort('symbol')}>
                                <span className="inline-flex items-center gap-1">Símbolo <SortIcon col="symbol" /></span>
                            </th>
                            <th className="px-3 py-3">Tipo</th>
                            <th className="px-3 py-3">Dirección</th>
                            <th className="px-3 py-3">Entrada</th>
                            <th className="px-3 py-3">Salida</th>
                            <th className="px-3 py-3">Qty</th>
                            <th className="px-3 py-3 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none" onClick={() => toggleSort('pnl')}>
                                <span className="inline-flex items-center gap-1">P&L <SortIcon col="pnl" /></span>
                            </th>
                            <th className="px-3 py-3 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none" onClick={() => toggleSort('date')}>
                                <span className="inline-flex items-center gap-1">Fecha <SortIcon col="date" /></span>
                            </th>
                            <th className="px-3 py-3">Estado</th>
                            <th className="px-3 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                        {sorted.length === 0 && (
                            <tr>
                                <td colSpan={10} className="py-12 text-center text-xs text-gray-400">
                                    {trades.length === 0 ? 'No hay trades. ¡Cargá el primero!' : 'Sin resultados para el filtro aplicado'}
                                </td>
                            </tr>
                        )}
                        {sorted.map((t) => (
                            <tr key={t.id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-100">
                                <td className="px-5 py-3 font-semibold text-gray-900 dark:text-gray-100">{t.symbol}</td>
                                <td className="px-3 py-3 text-gray-500 dark:text-gray-400 text-xs">{t.assetClass}</td>
                                <td className="px-3 py-3">
                                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${t.side === 'Buy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        {t.side === 'Buy' ? '▲' : '▼'} {t.side}
                                    </span>
                                </td>
                                <td className="px-3 py-3 text-gray-700 dark:text-gray-300">${t.entryPrice.toFixed(2)}</td>
                                <td className="px-3 py-3 text-gray-700 dark:text-gray-300">
                                    {t.exitPrice !== null ? `$${t.exitPrice.toFixed(2)}` : <span className="text-xs text-blue-400">—</span>}
                                </td>
                                <td className="px-3 py-3 text-gray-500 dark:text-gray-400">{t.quantity}</td>
                                <td className={`px-3 py-3 font-semibold ${t.pnl > 0 ? 'text-green-500' : t.pnl < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                                    {t.status === 'open' ? '—' : `${t.pnl >= 0 ? '+' : ''}$${t.pnl.toFixed(2)}`}
                                    {t.status !== 'open' && <span className="ml-1 text-xs font-normal opacity-70">({t.pnlPercent >= 0 ? '+' : ''}{t.pnlPercent.toFixed(1)}%)</span>}
                                </td>
                                <td className="px-3 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{t.entryDate}</td>
                                <td className="px-3 py-3">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${t.status === 'won' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : t.status === 'lost' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}>
                                        {t.status === 'won' ? 'Ganado' : t.status === 'lost' ? 'Perdido' : 'Abierto'}
                                    </span>
                                </td>
                                <td className="px-3 py-3">
                                    <button
                                        onClick={() => onDelete(t.id)}
                                        className="cursor-pointer rounded-lg p-1 text-gray-300 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                                        aria-label="Eliminar trade"
                                    >
                                        <TrashIcon className="h-3.5 w-3.5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            {sorted.length > 0 && (
                <div className="border-t border-gray-100 dark:border-gray-700 px-5 py-3 text-xs text-gray-400">
                    {sorted.length} trade{sorted.length !== 1 ? 's' : ''} mostrado{sorted.length !== 1 ? 's' : ''}
                </div>
            )}
        </div>
    );
}
