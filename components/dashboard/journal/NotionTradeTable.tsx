'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { PlusIcon, Trash2Icon, CheckIcon, MinusIcon } from 'lucide-react';
import type { Trade, TradeResult } from '@/lib/journal/types';

// ──────────────────────────────────────────────────────────────────────────────
// Column Definitions
// ──────────────────────────────────────────────────────────────────────────────
type ColType = 'text' | 'number' | 'date' | 'time' | 'select' | 'boolean' | 'calc';

interface ColDef {
    key: string;
    label: string;
    type: ColType;
    width: number;
    options?: string[];
    placeholder?: string;
    readOnly?: boolean;
}

const COLUMNS: ColDef[] = [
    { key: 'symbol', label: 'Par', type: 'text', width: 80, placeholder: 'EURUSD' },
    { key: 'entryDate', label: 'Fecha', type: 'date', width: 110 },
    { key: 'entryTime', label: 'Hora Ejecución', type: 'time', width: 90 },
    { key: 'executable', label: 'Ejecutable', type: 'boolean', width: 82 },
    { key: 'htfDirection', label: 'Dirección (HTF)', type: 'select', width: 112, options: ['—', 'Long', 'Short', 'Neutral'] },
    { key: 'ltfDirection', label: '(LTF)', type: 'select', width: 90, options: ['—', 'Long', 'Short', 'Neutral'] },
    { key: 'side', label: 'Dirección', type: 'select', width: 90, options: ['Buy', 'Sell'] },
    { key: 'pullback', label: 'Pullback', type: 'boolean', width: 80 },
    { key: 'entryType', label: 'Entrada', type: 'text', width: 90, placeholder: 'OB, BOS…' },
    { key: 'rrObtained', label: 'RR', type: 'number', width: 64, placeholder: '1.5' },
    { key: 'targetPrice', label: 'Target', type: 'number', width: 80, placeholder: '1.1050' },
    { key: 'result', label: 'Resultado', type: 'select', width: 90, options: ['—', 'TP', 'SL', 'BE', 'Running'] },
    { key: '_duration', label: 'Duración', type: 'calc', width: 80, readOnly: true },
    { key: 'targetMax', label: 'Target Max', type: 'number', width: 88, placeholder: '0' },
    { key: 'targetMaxFinal', label: 'Target Max Final', type: 'number', width: 108, placeholder: '0' },
    { key: 'pnl', label: 'PnL', type: 'number', width: 88, placeholder: '0' },
    { key: 'proud', label: 'Orgulloso', type: 'boolean', width: 82 },
    { key: 'wouldReenter', label: '¿Volvería a entrar?', type: 'boolean', width: 100 },
    { key: 'howContinued', label: '¿Cómo siguió…?', type: 'text', width: 130, placeholder: 'Continuó la tendencia…' },
    { key: 'management', label: 'Gestión', type: 'text', width: 110, placeholder: 'Notas…' },
    { key: 'correctManagement', label: 'Gestión Correcta', type: 'boolean', width: 104 },
    { key: 'errorNotes', label: 'Error', type: 'text', width: 110, placeholder: 'Ninguno…' },
    { key: 'againstChecklist', label: 'En contra/Chequ…', type: 'text', width: 125, placeholder: 'Checklist fallida…' },
];

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────
function calcDuration(trade: Trade): string {
    if (!trade.exitDate || !trade.entryDate) return '—';
    const ms = Math.abs(
        new Date(trade.exitDate).getTime() - new Date(trade.entryDate).getTime(),
    );
    const d = Math.round(ms / (1000 * 60 * 60 * 24));
    return d === 0 ? '< 1d' : `${d}d`;
}

function getCellRawValue(trade: Trade, key: string): string {
    if (key === '_duration') return calcDuration(trade);
    const v = (trade as Record<string, unknown>)[key];
    if (v === undefined || v === null) return '';
    return String(v);
}

function derivedStatus(result: string, pnl: number): Trade['status'] {
    if (result === 'TP') return 'won';
    if (result === 'SL' || result === 'BE') return 'lost';
    if (pnl > 0) return 'won';
    if (pnl < 0) return 'lost';
    return 'open';
}

function parseColValue(col: ColDef, raw: string) {
    if (col.type === 'number') return raw === '' ? undefined : parseFloat(raw.replace(',', '.')) || 0;
    if (col.type === 'boolean') return raw === 'true';
    if (raw === '—' || raw === '') return undefined;
    return raw;
}

// ──────────────────────────────────────────────────────────────────────────────
// Cell Display (read mode)
// ──────────────────────────────────────────────────────────────────────────────
function CellDisplay({ trade, col }: { trade: Trade; col: ColDef }) {
    const raw = getCellRawValue(trade, col.key);

    if (col.type === 'boolean') {
        const checked = (trade as Record<string, unknown>)[col.key] === true;
        return (
            <div className="flex items-center justify-center">
                {checked
                    ? <CheckIcon className="h-3.5 w-3.5 text-primary-500" />
                    : <MinusIcon className="h-3 w-3 text-gray-200 dark:text-gray-600" />}
            </div>
        );
    }

    if (col.key === 'side') {
        if (!raw) return <span className="text-gray-300 dark:text-gray-600">—</span>;
        return (
            <span className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-semibold ${raw === 'Buy'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                {raw === 'Buy' ? '▲' : '▼'} {raw === 'Buy' ? 'Long' : 'Short'}
            </span>
        );
    }

    if (col.key === 'htfDirection' || col.key === 'ltfDirection') {
        if (!raw || raw === '—' || raw === 'undefined') return <span className="text-gray-300 dark:text-gray-600">—</span>;
        return (
            <span className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${raw === 'Long'
                ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400'
                : raw === 'Short'
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                {raw}
            </span>
        );
    }

    if (col.key === 'result') {
        if (!raw || raw === '—' || raw === 'undefined') return <span className="text-gray-300 dark:text-gray-600">—</span>;
        return (
            <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${raw === 'TP'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : raw === 'SL'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : raw === 'BE'
                        ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                {raw}
            </span>
        );
    }

    if (col.key === 'pnl') {
        const num = parseFloat(raw);
        if (isNaN(num)) return <span className="text-gray-300 dark:text-gray-600">—</span>;
        return (
            <span className={`font-semibold text-xs ${num > 0 ? 'text-green-500' : num < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                {num > 0 ? '+' : ''}{num.toFixed(2)}
            </span>
        );
    }

    if (col.key === 'rrObtained') {
        if (!raw) return <span className="text-gray-300 dark:text-gray-600">—</span>;
        return <span className="font-mono text-xs text-violet-500 dark:text-violet-400">{raw}</span>;
    }

    if (!raw || raw === 'undefined') {
        return <span className="text-gray-300 dark:text-gray-600">—</span>;
    }

    return <span className="text-xs text-gray-700 dark:text-gray-300 truncate block max-w-full">{raw}</span>;
}

// ──────────────────────────────────────────────────────────────────────────────
// Cell Editor (edit mode)
// ──────────────────────────────────────────────────────────────────────────────
interface EditorProps {
    col: ColDef;
    value: string;
    onChange: (v: string) => void;
    onCommit: () => void;
    onCancel: () => void;
}

function CellEditor({ col, value, onChange, onCommit, onCancel }: EditorProps) {
    const ref = useRef<HTMLInputElement & HTMLSelectElement>(null);

    useEffect(() => {
        ref.current?.focus();
        if (ref.current && 'select' in ref.current && typeof ref.current.select === 'function') {
            (ref.current as HTMLInputElement).select();
        }
    }, []);

    const keyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); onCommit(); }
        if (e.key === 'Escape') onCancel();
    };

    const base = "w-full bg-transparent text-xs text-gray-900 dark:text-gray-100 outline-none placeholder-gray-300";

    if (col.type === 'select') {
        return (
            <select
                ref={ref as React.RefObject<HTMLSelectElement>}
                value={value}
                onChange={(e) => { onChange(e.target.value); setTimeout(onCommit, 50); }}
                onBlur={onCommit}
                onKeyDown={keyDown}
                className={`${base} cursor-pointer`}
            >
                {col.options?.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
        );
    }

    if (col.type === 'date') {
        return (
            <input ref={ref as React.RefObject<HTMLInputElement>} type="date" value={value}
                onChange={(e) => onChange(e.target.value)} onBlur={onCommit} onKeyDown={keyDown}
                className={base} />
        );
    }

    if (col.type === 'time') {
        return (
            <input ref={ref as React.RefObject<HTMLInputElement>} type="time" value={value}
                onChange={(e) => onChange(e.target.value)} onBlur={onCommit} onKeyDown={keyDown}
                className={base} />
        );
    }

    if (col.type === 'number') {
        return (
            <input ref={ref as React.RefObject<HTMLInputElement>} type="text" inputMode="decimal"
                value={value} placeholder={col.placeholder ?? '0'}
                onChange={(e) => onChange(e.target.value)} onBlur={onCommit} onKeyDown={keyDown}
                className={base} />
        );
    }

    // text (default)
    return (
        <input ref={ref as React.RefObject<HTMLInputElement>} type="text" value={value}
            placeholder={col.placeholder ?? ''}
            onChange={(e) => onChange(e.target.value)} onBlur={onCommit} onKeyDown={keyDown}
            className={base} />
    );
}

// ──────────────────────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────────────────────
interface Props {
    trades: Trade[];
    accountId: string;
    onAdd: (trade: Omit<Trade, 'id'>) => void;
    onUpdate: (tradeId: string, data: Partial<Trade>) => void;
    onDelete: (tradeId: string) => void;
}

type EditKey = { tradeId: string; col: string } | null;

export function NotionTradeTable({ trades, accountId, onAdd, onUpdate, onDelete }: Props) {
    const [editing, setEditing] = useState<EditKey>(null);
    const [editValue, setEditValue] = useState('');
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);

    // Sort trades by entry date desc
    const sorted = [...trades].sort(
        (a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime(),
    );

    const startEdit = useCallback((tradeId: string, col: ColDef) => {
        if (col.readOnly || col.type === 'calc') return;
        const trade = trades.find((t) => t.id === tradeId)!;
        const raw = getCellRawValue(trade, col.key);
        setEditing({ tradeId, col: col.key });
        setEditValue(raw === '—' || raw === 'undefined' ? '' : raw);
    }, [trades]);

    const commitEdit = useCallback(() => {
        if (!editing) return;
        const col = COLUMNS.find((c) => c.key === editing.col)!;
        const trade = trades.find((t) => t.id === editing.tradeId)!;

        let update: Partial<Trade> = {};
        const parsed = parseColValue(col, editValue);

        if (col.key === 'result') {
            const resultStr = (parsed ?? '') as string;
            update = {
                result: (resultStr === 'TP' || resultStr === 'SL' || resultStr === 'BE')
                    ? resultStr as TradeResult
                    : undefined,
                status: derivedStatus(resultStr, trade.pnl),
            };
        } else if (col.key === 'pnl') {
            const pnlNum = typeof parsed === 'number' ? parsed : 0;
            update = {
                pnl: pnlNum,
                pnlPercent: trade.riskUsd ? (pnlNum / trade.riskUsd) * 100 : 0,
                status: derivedStatus(trade.result ?? '', pnlNum),
            };
        } else if (col.key === 'side') {
            update = { side: (editValue === 'Sell' ? 'Sell' : 'Buy') };
        } else {
            (update as Record<string, unknown>)[col.key] = parsed;
        }

        onUpdate(editing.tradeId, update);
        setEditing(null);
        setEditValue('');
    }, [editing, editValue, trades, onUpdate]);

    const cancelEdit = useCallback(() => {
        setEditing(null);
        setEditValue('');
    }, []);

    const toggleBoolean = useCallback((tradeId: string, key: string) => {
        const trade = trades.find((t) => t.id === tradeId)!;
        const current = (trade as Record<string, unknown>)[key] === true;
        onUpdate(tradeId, { [key]: !current } as Partial<Trade>);
    }, [trades, onUpdate]);

    const handleAddRow = useCallback(() => {
        const today = new Date().toISOString().split('T')[0];
        onAdd({
            accountId,
            symbol: '',
            assetClass: 'Forex',
            side: 'Buy',
            entryPrice: 0,
            exitPrice: null,
            quantity: 1,
            entryDate: today,
            exitDate: null,
            pnl: 0,
            pnlPercent: 0,
            status: 'open',
            source: 'manual',
        });
    }, [accountId, onAdd]);

    const totalWidth = COLUMNS.reduce((s, c) => s + c.width, 0) + 40 + 36; // row# + delete

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-md dark:border dark:border-gray-700/50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-5 py-3">
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-50 text-sm">Journal de Trades</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Hacé click en cualquier celda para editar</p>
                </div>
                <button
                    onClick={handleAddRow}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    <PlusIcon className="h-3.5 w-3.5" />
                    Nueva fila
                </button>
            </div>

            {/* Scrollable table */}
            <div className="overflow-x-auto" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <table style={{ minWidth: totalWidth, borderCollapse: 'collapse' }} className="w-full">
                    {/* Sticky header */}
                    <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-850">
                        <tr className="bg-gray-50 dark:bg-gray-900/80">
                            {/* Row number */}
                            <th style={{ width: 40 }} className="text-left pl-4 py-2 text-xs font-medium text-gray-400 dark:text-gray-500 border-b border-r border-gray-100 dark:border-gray-700">
                                #
                            </th>
                            {COLUMNS.map((col) => (
                                <th
                                    key={col.key}
                                    style={{ width: col.width, minWidth: col.width }}
                                    className="text-left px-2 py-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-r border-gray-100 dark:border-gray-700 whitespace-nowrap"
                                >
                                    {col.label}
                                </th>
                            ))}
                            {/* Delete */}
                            <th style={{ width: 36 }} className="border-b border-gray-100 dark:border-gray-700" />
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                        {sorted.length === 0 && (
                            <tr>
                                <td
                                    colSpan={COLUMNS.length + 2}
                                    className="py-14 text-center text-xs text-gray-400"
                                >
                                    No hay trades. Hacé click en "Nueva fila" o subí un PDF para empezar.
                                </td>
                            </tr>
                        )}

                        {sorted.map((trade, idx) => {
                            const isHovered = hoveredRow === trade.id;
                            return (
                                <tr
                                    key={trade.id}
                                    onMouseEnter={() => setHoveredRow(trade.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    className={`transition-colors duration-75 ${isHovered ? 'bg-gray-50 dark:bg-gray-700/30' : 'bg-white dark:bg-gray-800'}`}
                                >
                                    {/* Row number */}
                                    <td className="pl-4 pr-2 py-1.5 text-xs text-gray-300 dark:text-gray-600 border-r border-gray-100 dark:border-gray-700 select-none">
                                        {sorted.length - idx}
                                        {trade.source === 'pdf' && (
                                            <span className="ml-1 text-[9px] text-primary-400 font-bold">PDF</span>
                                        )}
                                    </td>

                                    {COLUMNS.map((col) => {
                                        const isEditing = editing?.tradeId === trade.id && editing.col === col.key;
                                        const isBoolean = col.type === 'boolean';
                                        const isCalc = col.type === 'calc';

                                        return (
                                            <td
                                                key={col.key}
                                                style={{ width: col.width, minWidth: col.width }}
                                                onClick={() => {
                                                    if (isBoolean) { toggleBoolean(trade.id, col.key); return; }
                                                    if (!isCalc) startEdit(trade.id, col);
                                                }}
                                                className={`px-2 py-1.5 border-r border-gray-100 dark:border-gray-700 ${isCalc
                                                    ? 'bg-gray-50/50 dark:bg-gray-700/20 cursor-default'
                                                    : isBoolean
                                                        ? 'cursor-pointer'
                                                        : 'cursor-text'
                                                    } ${isEditing
                                                        ? 'ring-2 ring-inset ring-primary-400 bg-primary-50/30 dark:bg-primary-900/20'
                                                        : ''
                                                    } overflow-hidden`}
                                            >
                                                {isEditing ? (
                                                    <CellEditor
                                                        col={col}
                                                        value={editValue}
                                                        onChange={setEditValue}
                                                        onCommit={commitEdit}
                                                        onCancel={cancelEdit}
                                                    />
                                                ) : (
                                                    <CellDisplay trade={trade} col={col} />
                                                )}
                                            </td>
                                        );
                                    })}

                                    {/* Delete */}
                                    <td className="px-2 py-1.5 text-center">
                                        <button
                                            onClick={() => onDelete(trade.id)}
                                            className={`cursor-pointer rounded p-1 text-gray-300 transition-all hover:bg-red-50 hover:text-red-400 dark:hover:bg-red-900/20 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                                            aria-label="Eliminar fila"
                                        >
                                            <Trash2Icon className="h-3.5 w-3.5" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}

                        {/* Add row */}
                        <tr
                            onClick={handleAddRow}
                            className="cursor-pointer group border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                        >
                            <td className="pl-4 pr-2 py-2.5 border-r border-gray-100 dark:border-gray-700">
                                <PlusIcon className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600 group-hover:text-primary-400 transition-colors" />
                            </td>
                            <td colSpan={COLUMNS.length + 1} className="px-2 py-2.5 text-xs text-gray-300 dark:text-gray-600 group-hover:text-primary-400 transition-colors">
                                Nueva fila
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Footer count */}
            {trades.length > 0 && (
                <div className="border-t border-gray-100 dark:border-gray-700 px-5 py-2 text-xs text-gray-400 flex items-center justify-between">
                    <span>{trades.length} trade{trades.length !== 1 ? 's' : ''}</span>
                    <span className="text-gray-300 dark:text-gray-600">Tab / Enter para navegar · Escape para cancelar</span>
                </div>
            )}
        </div>
    );
}
