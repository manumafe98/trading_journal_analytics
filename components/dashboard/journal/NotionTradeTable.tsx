'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { PlusIcon, Trash2Icon, ImageIcon, BookOpen } from 'lucide-react';
import type { Trade, TradeResult } from '@/lib/journal/types';
import { TradeImagesModal } from './TradeImagesModal';
import { TradeNotesModal } from './TradeNotesModal';

// ──────────────────────────────────────────────────────────────────────────────
// Column Definitions
// ──────────────────────────────────────────────────────────────────────────────
type ColType = 'text' | 'number' | 'date' | 'time' | 'select' | 'calc';

interface ColDef {
    key: string;
    label: string;
    type: ColType;
    width: number;
    options?: string[];
    placeholder?: string;
    readOnly?: boolean;
}

const GEST_OPTIONS = ['—', 'No', 'EMA 5m', 'EMA 1m', 'EMA 15m', 'EMA 1h'];

const COLUMNS: ColDef[] = [
    { key: 'symbol', label: 'Par', type: 'text', width: 80, placeholder: 'EURUSD' },
    { key: 'entryDate', label: 'Fecha', type: 'date', width: 110 },
    { key: 'entryTime', label: 'Hora Ejecución', type: 'time', width: 90 },
    { key: 'executable', label: 'Ejecutable', type: 'select', width: 88, options: ['—', 'Sí', 'No'] },
    { key: 'htfDirection', label: 'Dirección (HTF)', type: 'select', width: 115, options: ['—', 'Long', 'Short', 'Lateral'] },
    { key: 'ltfDirection', label: '(LTF)', type: 'select', width: 90, options: ['—', 'Long', 'Short', 'Lateral'] },
    { key: 'side', label: 'Dirección', type: 'select', width: 90, options: ['Long', 'Short'] },
    { key: 'pullback', label: 'Pullback', type: 'select', width: 82, options: ['—', '0.38', '0.5', '0.61', '0.7'] },
    { key: 'entryType', label: 'Entrada', type: 'select', width: 115, options: ['—', 'Diagonal 1m', 'Diagonal 30s', 'Limit'] },
    { key: 'rrObtained', label: 'RR', type: 'number', width: 64, placeholder: '1.5' },
    { key: 'targetPrice', label: 'Target', type: 'text', width: 110, placeholder: 'OB 1.1050…' },
    { key: 'result', label: 'Resultado', type: 'select', width: 90, options: ['—', 'TP', 'SL', 'BE', 'Running'] },
    { key: 'durationText', label: 'Duración', type: 'text', width: 80, placeholder: '2h30m' },
    { key: 'targetMax', label: 'Target Max', type: 'text', width: 110, placeholder: '2° objetivo…' },
    { key: 'targetMaxFinal', label: 'Target Max Final', type: 'select', width: 108, options: ['—', 'Sí', 'No'] },
    { key: 'pnl', label: 'PnL', type: 'text', width: 88, placeholder: '0 o 4.3%' },
    { key: 'proud', label: 'Orgulloso', type: 'select', width: 88, options: ['—', 'Sí', 'No'] },
    { key: 'wouldReenter', label: '¿Volvería a entrar?', type: 'select', width: 100, options: ['—', 'Sí', 'No'] },
    { key: 'howContinued', label: '¿Cómo siguió…?', type: 'select', width: 110, options: ['—', 'A favor', 'En contra'] },
    { key: 'management', label: 'Gestión', type: 'select', width: 110, options: GEST_OPTIONS },
    { key: 'correctManagement', label: 'Gestión Correcta', type: 'select', width: 115, options: GEST_OPTIONS },
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
    const v = (trade as unknown as Record<string, unknown>)[key];
    if (v === undefined || v === null) return '';
    return String(v);
}

function derivedStatus(result: string, pnl: number, pnlPercent?: number): Trade['status'] {
    if (result === 'TP') return 'won';
    if (result === 'SL') return 'lost';
    if (result === 'BE') return 'be';

    // Fallback to numeric logic if result is missing
    const val = (pnlPercent !== 0 && pnlPercent !== undefined) ? pnlPercent : pnl;
    if (Math.abs(val) <= 0.001) return 'be';
    if (val > 0) return 'won';
    if (val < 0) return 'lost';
    return 'open';
}

function parseColValue(col: ColDef, raw: string) {
    if (col.type === 'number') return raw === '' ? undefined : parseFloat(raw.replace(',', '.')) || 0;
    if (raw === '—' || raw === '') return undefined;
    return raw;
}

// ──────────────────────────────────────────────────────────────────────────────
// Cell Display (read mode)
// ──────────────────────────────────────────────────────────────────────────────
function CellDisplay({ trade, col }: { trade: Trade; col: ColDef }) {
    const raw = getCellRawValue(trade, col.key);
    const empty = !raw || raw === '—' || raw === 'undefined' || raw === '';

    // Direction (trade side): Long/Short badges
    if (col.key === 'side') {
        if (empty) return <span className="text-gray-300 dark:text-gray-600">—</span>;
        const isLong = raw === 'Long' || raw === 'Buy';
        return (
            <span className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-semibold ${isLong
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                {isLong ? '▲ Long' : '▼ Short'}
            </span>
        );
    }

    // HTF/LTF direction badges
    if (col.key === 'htfDirection' || col.key === 'ltfDirection') {
        if (empty) return <span className="text-gray-300 dark:text-gray-600">—</span>;
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

    // Result badges
    if (col.key === 'result') {
        if (empty) return <span className="text-gray-300 dark:text-gray-600">—</span>;
        return (
            <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${raw === 'TP' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : raw === 'SL' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : raw === 'BE' ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                {raw}
            </span>
        );
    }

    // Sí/No columns — colored badges
    if (['executable', 'proud', 'wouldReenter'].includes(col.key)) {
        if (empty) return <span className="text-gray-300 dark:text-gray-600">—</span>;
        return (
            <span className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${raw === 'Sí'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                {raw}
            </span>
        );
    }

    // ¿Cómo siguió? — A favor green, En contra red
    if (col.key === 'howContinued') {
        if (empty) return <span className="text-gray-300 dark:text-gray-600">—</span>;
        return (
            <span className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${raw === 'A favor'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                {raw}
            </span>
        );
    }

    // PnL — colored number formats (handles flat currency or percentage)
    if (col.key === 'pnl') {
        const hasPercent = trade.pnlPercent !== 0 && trade.pnlPercent !== undefined;
        const hasPnl = trade.pnl !== 0 && trade.pnl !== undefined;

        if (hasPercent) {
            const p = trade.pnlPercent!;
            return (
                <span className={`font-semibold text-xs ${p > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {p > 0 ? '+' : ''}{p.toFixed(2)}%
                </span>
            );
        } else if (hasPnl) {
            const n = trade.pnl;
            return (
                <span className={`font-semibold text-xs ${n > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {n > 0 ? '+' : ''}${n.toFixed(2)}
                </span>
            );
        } else {
            return <span className="text-gray-300 dark:text-gray-600">—</span>;
        }
    }

    // RR — violet mono
    if (col.key === 'rrObtained') {
        if (empty) return <span className="text-gray-300 dark:text-gray-600">—</span>;
        return <span className="font-mono text-xs text-violet-500 dark:text-violet-400">{raw}</span>;
    }

    // Pullback — show as a pill
    if (col.key === 'pullback') {
        if (empty) return <span className="text-gray-300 dark:text-gray-600">—</span>;
        return <span className="font-mono text-xs text-amber-600 dark:text-amber-400">{raw}</span>;
    }

    if (empty) return <span className="text-gray-300 dark:text-gray-600">—</span>;
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
    onCommitWithValue: (v: string) => void;
    onCancel: () => void;
}

function CellEditor({ col, value, onChange, onCommit, onCommitWithValue, onCancel }: EditorProps) {
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
                defaultValue={value}
                onChange={(e) => {
                    // Commit directly with the picked value — no async, no blur race
                    onCommitWithValue(e.target.value);
                }}
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

// ──────────────────────────────────────────────────────────────────────────────
// Shared logic: build and dispatch the trade update for a given column + value
// ──────────────────────────────────────────────────────────────────────────────
function buildUpdate(col: ColDef, rawValue: string, trade: Trade): Partial<Trade> {
    const parsed = parseColValue(col, rawValue);

    if (col.key === 'result') {
        const resultStr = (parsed ?? '') as string;
        return {
            result: (resultStr === 'TP' || resultStr === 'SL' || resultStr === 'BE')
                ? resultStr as TradeResult
                : undefined,
            status: derivedStatus(resultStr, trade.pnl),
        };
    }
    if (col.key === 'pnl') {
        const isPercent = rawValue.includes('%');
        const num = parseFloat(rawValue.replace(/[^\d.\-]/g, '')) || 0;

        return {
            pnl: isPercent ? 0 : num,
            pnlPercent: isPercent ? num : 0,
            status: derivedStatus(trade.result ?? '', isPercent ? 0 : num, isPercent ? num : 0),
        };
    }
    if (col.key === 'side') {
        return { side: (rawValue === 'Short' ? 'Sell' : 'Buy') };
    }
    return { [col.key]: parsed } as Partial<Trade>;
}

export function NotionTradeTable({ trades, accountId, onAdd, onUpdate, onDelete }: Props) {
    const [editing, setEditing] = useState<EditKey>(null);
    const [editValue, setEditValue] = useState('');
    // Ref mirrors editValue so commitEdit always reads the latest — avoids stale closure
    const editValueRef = useRef('');
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);

    // Modal states
    const [imagesModalTradeId, setImagesModalTradeId] = useState<string | null>(null);
    const [notesModalTradeId, setNotesModalTradeId] = useState<string | null>(null);

    const setCurrentValue = useCallback((v: string) => {
        editValueRef.current = v;
        setEditValue(v);
    }, []);

    // Trades maintain insertion order (no resorting)
    const sorted = [...trades];

    const startEdit = useCallback((tradeId: string, col: ColDef) => {
        if (col.readOnly || col.type === 'calc') return;
        const trade = trades.find((t) => t.id === tradeId)!;
        const raw = getCellRawValue(trade, col.key);
        const initial = raw === '—' || raw === 'undefined' ? '' : raw;
        editValueRef.current = initial;
        setEditValue(initial);
        setEditing({ tradeId, col: col.key });
    }, [trades]);

    // commitEdit: called for text/number/date/time fields on blur/Enter
    const commitEdit = useCallback(() => {
        if (!editing) return;
        const col = COLUMNS.find((c) => c.key === editing.col)!;
        const trade = trades.find((t) => t.id === editing.tradeId)!;
        const currentValue = editValueRef.current;
        onUpdate(editing.tradeId, buildUpdate(col, currentValue, trade));
        setEditing(null);
        editValueRef.current = '';
        setEditValue('');
    }, [editing, trades, onUpdate]);

    // commitWithValue: called directly by select onChange with the chosen value
    const commitWithValue = useCallback((pickedValue: string) => {
        if (!editing) return;
        const col = COLUMNS.find((c) => c.key === editing.col)!;
        const trade = trades.find((t) => t.id === editing.tradeId)!;
        onUpdate(editing.tradeId, buildUpdate(col, pickedValue, trade));
        setEditing(null);
        editValueRef.current = '';
        setEditValue('');
    }, [editing, trades, onUpdate]);

    const cancelEdit = useCallback(() => {
        setEditing(null);
        editValueRef.current = '';
        setEditValue('');
    }, []);



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
            images: [],
            journalNotes: '',
        });
    }, [accountId, onAdd]);

    const totalWidth = COLUMNS.reduce((s, c) => s + c.width, 0) + 40 + 90; // row# + delete + images + notes

    // Active trade for modal
    const tradeForImages = imagesModalTradeId
        ? trades.find(t => t.id === imagesModalTradeId)
        : null;

    const tradeForNotes = notesModalTradeId
        ? trades.find(t => t.id === notesModalTradeId)
        : null;

    return (
        <>
            <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-md dark:border dark:border-gray-700/50 overflow-hidden relative">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-5 py-3">
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-50 text-sm">Registro Central de Backtesting</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Editá las variables de éxito y adjuntá imágenes de cada trade</p>
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
                    <table style={{ minWidth: totalWidth, borderCollapse: 'collapse' }} className="w-full relative">
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
                                {/* Actions (Images + Delete) */}
                                <th style={{ width: 90 }} className="text-center px-1 py-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-100 dark:border-gray-700">
                                    Extras
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                            {sorted.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={COLUMNS.length + 2}
                                        className="py-14 text-center text-xs text-gray-400"
                                    >
                                        No hay trades. Hacé click en "Nueva fila" o subí un CSV para empezar.
                                    </td>
                                </tr>
                            )}

                            {sorted.map((trade, idx) => {
                                const isHovered = hoveredRow === trade.id;
                                const imgCount = trade.images?.length || 0;
                                const hasNotes = !!trade.journalNotes && trade.journalNotes.trim().length > 0;

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
                                                <span className="ml-1 text-[9px] text-primary-400 font-bold">CSV</span>
                                            )}
                                        </td>

                                        {COLUMNS.map((col) => {
                                            const isEditing = editing?.tradeId === trade.id && editing.col === col.key;
                                            const isCalc = col.type === 'calc';

                                            return (
                                                <td
                                                    key={col.key}
                                                    style={{ width: col.width, minWidth: col.width }}
                                                    onClick={() => {
                                                        if (!isCalc) startEdit(trade.id, col);
                                                    }}
                                                    className={`px-2 py-1.5 border-r border-gray-100 dark:border-gray-700 ${isCalc ? 'bg-gray-50/50 dark:bg-gray-700/20 cursor-default' : 'cursor-pointer'
                                                        } ${isEditing
                                                            ? 'ring-2 ring-inset ring-primary-400 bg-primary-50/30 dark:bg-primary-900/20'
                                                            : ''
                                                        } overflow-hidden`}
                                                >
                                                    {isEditing ? (
                                                        <CellEditor
                                                            col={col}
                                                            value={editValue}
                                                            onChange={setCurrentValue}
                                                            onCommit={commitEdit}
                                                            onCommitWithValue={commitWithValue}
                                                            onCancel={cancelEdit}
                                                        />
                                                    ) : (
                                                        <CellDisplay trade={trade} col={col} />
                                                    )}
                                                </td>
                                            );
                                        })}

                                        {/* Actions (Images + Delete + Notes) */}
                                        <td className="px-2 py-1.5 border-l border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-850/30">
                                            <div className={`flex items-center justify-center gap-1.5 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
                                                <button
                                                    onClick={() => setImagesModalTradeId(trade.id)}
                                                    className={`relative cursor-pointer rounded p-1 transition-all ${imgCount > 0
                                                        ? 'text-primary-500 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20'
                                                        : 'text-gray-300 hover:bg-gray-100 hover:text-gray-500 dark:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-400'
                                                        }`}
                                                    aria-label="Ver imágenes"
                                                >
                                                    <ImageIcon className="h-3.5 w-3.5" />
                                                    {imgCount > 0 && (
                                                        <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary-500 text-[8px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-gray-800">
                                                            {imgCount}
                                                        </span>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => setNotesModalTradeId(trade.id)}
                                                    className={`relative cursor-pointer rounded p-1 transition-all ${hasNotes
                                                        ? 'text-violet-500 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-900/20'
                                                        : 'text-gray-300 hover:bg-gray-100 hover:text-gray-500 dark:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-400'
                                                        }`}
                                                    aria-label="Notas del Trade"
                                                >
                                                    <BookOpen className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(trade.id)}
                                                    className="cursor-pointer rounded p-1 text-gray-300 transition-all hover:bg-red-50 hover:text-red-400 dark:text-gray-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                                    aria-label="Eliminar fila"
                                                >
                                                    <Trash2Icon className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
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
                        <span className="text-gray-300 dark:text-gray-600">Click en la imagen al final de cada fila para guardar capturas</span>
                    </div>
                )}

                {/* Modal injection */}
            </div>

            {tradeForImages && (
                <TradeImagesModal
                    trade={tradeForImages}
                    onClose={() => setImagesModalTradeId(null)}
                    onSave={(images) => {
                        onUpdate(tradeForImages.id, { images });
                    }}
                />
            )}

            {tradeForNotes && (
                <TradeNotesModal
                    trade={tradeForNotes}
                    onClose={() => setNotesModalTradeId(null)}
                    onSave={(journalNotes) => {
                        onUpdate(tradeForNotes.id, { journalNotes });
                    }}
                />
            )}
        </>
    );
}
