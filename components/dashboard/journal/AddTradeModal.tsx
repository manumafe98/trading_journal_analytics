'use client';

import { useState, useEffect } from 'react';
import { XIcon } from 'lucide-react';
import type { Trade, TradeSide, AssetClass, TradeStatus } from '@/lib/journal/types';

type TradeInput = Omit<Trade, 'id' | 'pnl' | 'pnlPercent' | 'status'>;

interface Props {
    accountId: string;
    onAdd: (trade: Omit<Trade, 'id'>) => void;
    onClose: () => void;
}

const ASSET_CLASSES: AssetClass[] = ['Stock', 'Crypto', 'Forex', 'Futures', 'Options', 'Other'];

export function AddTradeModal({ accountId, onAdd, onClose }: Props) {
    const [symbol, setSymbol] = useState('');
    const [assetClass, setAssetClass] = useState<AssetClass>('Stock');
    const [side, setSide] = useState<TradeSide>('Buy');
    const [entryPrice, setEntryPrice] = useState('');
    const [exitPrice, setExitPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
    const [exitDate, setExitDate] = useState('');
    const [stopLoss, setStopLoss] = useState('');
    const [takeProfit, setTakeProfit] = useState('');
    const [notes, setNotes] = useState('');

    // derived
    const [preview, setPreview] = useState<{ pnl: number; pnlPercent: number; status: TradeStatus } | null>(null);

    useEffect(() => {
        const ep = parseFloat(entryPrice);
        const xp = parseFloat(exitPrice);
        const qty = parseFloat(quantity);
        if (!ep || !qty) { setPreview(null); return; }
        if (!xp) { setPreview({ pnl: 0, pnlPercent: 0, status: 'open' }); return; }
        const cost = ep * qty;
        const pnl = side === 'Buy' ? (xp - ep) * qty : (ep - xp) * qty;
        const pnlPercent = (pnl / cost) * 100;
        setPreview({ pnl, pnlPercent, status: pnl >= 0 ? 'won' : 'lost' });
    }, [entryPrice, exitPrice, quantity, side]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const ep = parseFloat(entryPrice);
        const xp = parseFloat(exitPrice) || null;
        const qty = parseFloat(quantity);
        const cost = ep * qty;
        const pnl = xp !== null
            ? side === 'Buy' ? (xp - ep) * qty : (ep - xp) * qty
            : 0;
        const pnlPercent = xp !== null ? (pnl / cost) * 100 : 0;
        const status: TradeStatus = xp === null ? 'open' : pnl >= 0 ? 'won' : 'lost';

        onAdd({
            accountId,
            symbol: symbol.toUpperCase().trim(),
            assetClass,
            side,
            entryPrice: ep,
            exitPrice: xp,
            quantity: qty,
            entryDate,
            exitDate: exitDate || null,
            pnl,
            pnlPercent,
            stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
            takeProfit: takeProfit ? parseFloat(takeProfit) : undefined,
            notes: notes.trim() || undefined,
            status,
        });
        onClose();
    };

    const inputCls = "w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-50 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors";
    const labelCls = "mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400";

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4 pt-8">
            <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl animate-fade-in-up mb-8">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-6 py-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">Cargar Trade</h2>
                    <button onClick={onClose} className="cursor-pointer rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <XIcon className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {/* Row 1: Symbol + Asset class */}
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className={labelCls}>Símbolo *</label>
                            <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)}
                                placeholder="AAPL, BTC, EUR/USD..." required className={inputCls} />
                        </div>
                        <div className="w-36">
                            <label className={labelCls}>Tipo de activo</label>
                            <select value={assetClass} onChange={(e) => setAssetClass(e.target.value as AssetClass)} className={`${inputCls} cursor-pointer`}>
                                {ASSET_CLASSES.map((ac) => <option key={ac} value={ac}>{ac}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Row 2: Side toggle */}
                    <div>
                        <label className={labelCls}>Dirección *</label>
                        <div className="flex gap-2">
                            {(['Buy', 'Sell'] as TradeSide[]).map((s) => (
                                <button
                                    key={s} type="button"
                                    onClick={() => setSide(s)}
                                    className={`flex-1 cursor-pointer rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${side === s
                                        ? s === 'Buy'
                                            ? 'bg-green-500 text-white shadow-md'
                                            : 'bg-red-500 text-white shadow-md'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {s === 'Buy' ? '▲ Buy (Long)' : '▼ Sell (Short)'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Row 3: Prices + Qty */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className={labelCls}>Precio entrada *</label>
                            <input type="number" value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)}
                                placeholder="180.00" min="0" step="any" required className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Precio salida</label>
                            <input type="number" value={exitPrice} onChange={(e) => setExitPrice(e.target.value)}
                                placeholder="190.00 (vacío=abierto)" min="0" step="any" className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Cantidad *</label>
                            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                                placeholder="10" min="0" step="any" required className={inputCls} />
                        </div>
                    </div>

                    {/* Row 4: Dates */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>Fecha entrada *</label>
                            <input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)}
                                required className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Fecha salida</label>
                            <input type="date" value={exitDate} onChange={(e) => setExitDate(e.target.value)}
                                className={inputCls} />
                        </div>
                    </div>

                    {/* Row 5: SL / TP (optional) */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>Stop Loss <span className="text-gray-400">(opcional)</span></label>
                            <input type="number" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)}
                                placeholder="175.00" min="0" step="any" className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Take Profit <span className="text-gray-400">(opcional)</span></label>
                            <input type="number" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)}
                                placeholder="195.00" min="0" step="any" className={inputCls} />
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className={labelCls}>Notas <span className="text-gray-400">(opcional)</span></label>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                            rows={2} placeholder="Setup, razón de entrada, emociones..."
                            className={`${inputCls} resize-none`} />
                    </div>

                    {/* P&L Preview */}
                    {preview && (
                        <div className={`rounded-xl p-3 text-sm font-medium flex items-center justify-between ${preview.status === 'open'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : preview.pnl >= 0
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                                : 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400'
                            }`}>
                            <span>
                                {preview.status === 'open' ? 'Trade abierto' : `P&L estimado:`}
                            </span>
                            {preview.status !== 'open' && (
                                <span className="font-bold">
                                    {preview.pnl >= 0 ? '+' : ''}{preview.pnl.toFixed(2)} ({preview.pnlPercent >= 0 ? '+' : ''}{preview.pnlPercent.toFixed(2)}%)
                                </span>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={onClose}
                            className="flex-1 cursor-pointer rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            Cancelar
                        </button>
                        <button type="submit"
                            className="flex-1 cursor-pointer rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-500 hover:shadow-md">
                            Guardar Trade
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
