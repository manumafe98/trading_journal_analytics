'use client';

import { useState, useRef, useEffect } from 'react';
import { X, BookOpen, Save } from 'lucide-react';
import type { Trade } from '@/lib/journal/types';
import { createPortal } from 'react-dom';

interface Props {
    trade: Trade;
    onClose: () => void;
    onSave: (notes: string) => void;
}

export function TradeNotesModal({ trade, onClose, onSave }: Props) {
    const [notes, setNotes] = useState<string>(trade.journalNotes || '');
    const [mounted, setMounted] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setMounted(true);
        document.body.style.overflow = 'hidden';

        // Auto-focus the textarea
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(notes.length, notes.length);
            }
        }, 100);

        return () => {
            document.body.style.overflow = '';
        };
    }, [notes.length]);

    const handleSave = () => {
        onSave(notes);
        onClose();
    };

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
            <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-800 shadow-2xl flex flex-col max-h-[90vh] animate-fade-in-up">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 p-5 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">
                                Diario del Trade: {trade.symbol || 'Sin Par'}
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(trade.entryDate + 'T00:00:00').toLocaleDateString()} · {trade.side}
                                {trade.pnl ? ` · ${trade.pnl > 0 ? '+' : ''}${trade.pnl.toFixed(2)}` : ''}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 overflow-y-auto p-5">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 ml-1">
                        Escribe aquí sincera y detalladamente lo que pensaste o sentiste antes, durante y después de esta operación.
                        Este texto será interpretado más adelante por la Inteligencia Artificial para detectar tus patrones de comportamiento.
                    </p>

                    <textarea
                        ref={textareaRef}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ej: Sabía que no estaba en el nivel óptimo, pero me aburrí de esperar y entré igual por miedo a quedarme afuera..."
                        className="w-full flex-1 min-h-[250px] resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4 text-sm text-gray-800 dark:text-gray-200 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                    />
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 p-4 shrink-0 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-violet-700 hover:-translate-y-0.5 cursor-pointer"
                    >
                        <Save className="h-4 w-4" />
                        Guardar Nota
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
