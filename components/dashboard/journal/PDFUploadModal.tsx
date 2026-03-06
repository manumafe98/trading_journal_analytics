'use client';

import { useState, useCallback, useRef } from 'react';
import {
    XIcon, UploadIcon, FileTextIcon, CheckIcon,
    AlertCircleIcon, Loader2Icon
} from 'lucide-react';
import { parseCSVToTrades } from '@/lib/journal/csvParser';
import { parseMDToTrades } from '@/lib/journal/mdParser';
import type { Trade } from '@/lib/journal/types';

interface Props {
    accountId: string;
    onImport: (trade: Omit<Trade, 'id'>) => void;
    onImportMany?: (trades: Omit<Trade, 'id'>[]) => void;
    onClose: () => void;
}

type Step = 'upload' | 'parsing' | 'preview' | 'error' | 'done';

export function ImportModal({ accountId, onImport, onImportMany, onClose }: Props) {
    const [step, setStep] = useState<Step>('upload');
    const [errorMsg, setErrorMsg] = useState('');
    const [parsed, setParsed] = useState<Omit<Trade, 'id'>[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const processFile = async (file: File) => {
        const isCSV = file.name.toLowerCase().endsWith('.csv');
        const isMD = file.name.toLowerCase().endsWith('.md') || file.name.toLowerCase().endsWith('.txt');

        if (!isCSV && !isMD) {
            setErrorMsg('El archivo debe ser CSV o Markdown (.md / .txt).');
            setStep('error');
            return;
        }

        setStep('parsing');
        try {
            let trades: Omit<Trade, 'id'>[] = [];

            if (isCSV) {
                trades = await parseCSVToTrades(file, accountId);
            } else {
                trades = await parseMDToTrades(file, accountId);
            }

            if (trades.length === 0) {
                setErrorMsg(`Se leyó el archivo pero no se detectaron trades. Asegurate de que el formato coincida con tu tabla de Notion (ej: "Par: EURUSD").`);
                setStep('error');
                return;
            }
            setParsed(trades);
            setStep('preview');
        } catch (e) {
            setErrorMsg(e instanceof Error ? e.message : String(e));
            setStep('error');
        }
    };

    const onDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) processFile(file);
        },
        [accountId]
    );

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleImport = () => {
        if (parsed.length === 0) return;
        if (onImportMany) {
            onImportMany(parsed);
        } else {
            parsed.forEach((t) => onImport(t));
        }
        setStep('done');
        setTimeout(onClose, 1200);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4 pt-10">
            <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-800 shadow-2xl animate-fade-in-up mb-8">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">Importar Trades de Notion</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Soporta exportaciones en formato CSV o Markdown (.md)</p>
                    </div>
                    <button onClick={onClose} className="cursor-pointer rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <XIcon className="h-5 w-5" />
                    </button>
                </div>

                <div className="px-6 py-5">
                    {/* STEP: upload */}
                    {step === 'upload' && (
                        <>
                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={onDrop}
                                onClick={() => inputRef.current?.click()}
                                className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-16 transition-all duration-200 ${isDragging
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                    : 'border-gray-200 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                    }`}
                            >
                                <input ref={inputRef} type="file" accept=".csv,.md,.txt" onChange={onFileChange} className="hidden" />
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-900/30">
                                    <UploadIcon className="h-7 w-7 text-primary-500" />
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">Arrastrá tu exportación de Notion aquí</p>
                                    <p className="text-sm text-gray-400 mt-1">.csv o .md (Markdown)</p>
                                </div>
                                <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs text-gray-500 dark:text-gray-400">
                                    Click para seleccionar archivo
                                </span>
                            </div>

                            {/* How to export guide */}
                            <div className="mt-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 px-4 py-3 text-xs text-blue-700 dark:text-blue-400">
                                <p className="font-semibold mb-1">¿Cómo exportar de Notion para que funcione perfecto?</p>
                                <ol className="list-decimal list-inside space-y-0.5 text-blue-600 dark:text-blue-300">
                                    <li>Abrí tu tabla de trades en Notion</li>
                                    <li>Hacé click en ··· (tres puntos arriba a la derecha) → <strong>Export</strong></li>
                                    <li>En Formato, seleccioná <strong>Markdown & CSV</strong></li>
                                    <li>Hacé click en <strong>Export</strong> (se descargará un .zip)</li>
                                    <li>Extraé el ZIP. Podés subir tanto el archivo <strong>.csv</strong> de la tabla como los <strong>.md</strong> individuales de cada trade.</li>
                                </ol>
                            </div>
                        </>
                    )}

                    {/* STEP: parsing */}
                    {step === 'parsing' && (
                        <div className="flex flex-col items-center justify-center gap-4 py-16">
                            <Loader2Icon className="h-10 w-10 animate-spin text-primary-500" />
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Procesando el archivo...</p>
                        </div>
                    )}

                    {/* STEP: error */}
                    {step === 'error' && (
                        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20">
                                <AlertCircleIcon className="h-7 w-7 text-red-500" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-gray-50">Hubo un problema con el archivo</p>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">{errorMsg}</p>
                            </div>
                            <button
                                onClick={() => setStep('upload')}
                                className="cursor-pointer rounded-xl border border-gray-200 dark:border-gray-600 px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Intentar de nuevo
                            </button>
                        </div>
                    )}

                    {/* STEP: done */}
                    {step === 'done' && (
                        <div className="flex flex-col items-center justify-center gap-3 py-12">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 dark:bg-green-900/20">
                                <CheckIcon className="h-8 w-8 text-green-500" />
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-gray-50">
                                {parsed.length} trade{parsed.length !== 1 ? 's' : ''} importado{parsed.length !== 1 ? 's' : ''} ✓
                            </p>
                        </div>
                    )}

                    {/* STEP: preview */}
                    {step === 'preview' && parsed.length > 0 && (
                        <div>
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 dark:bg-green-900/20">
                                    <FileTextIcon className="h-5 w-5 text-green-500" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-gray-50">
                                        {parsed.length} trade{parsed.length !== 1 ? 's' : ''} detectado{parsed.length !== 1 ? 's' : ''}
                                    </p>
                                    <p className="text-xs text-gray-400">Revisá la vista previa antes de importar</p>
                                </div>
                            </div>

                            {/* Preview table */}
                            <div className="rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-4 overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                                            {['Par', 'Fecha', 'Dir.', 'Resultado', 'RR', 'P&L'].map((h) => (
                                                <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                        {parsed.slice(0, 20).map((t, i) => {
                                            const isLong = t.side === 'Buy';
                                            const pnlPos = t.pnl >= 0;
                                            return (
                                                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                                                    <td className="px-3 py-2 font-semibold text-gray-800 dark:text-gray-200">{t.symbol}</td>
                                                    <td className="px-3 py-2 text-gray-500">{t.entryDate}</td>
                                                    <td className="px-3 py-2">
                                                        <span className={`font-medium ${isLong ? 'text-sky-600' : 'text-violet-600'}`}>
                                                            {isLong ? '▲' : '▼'}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {t.result ? (
                                                            <span className={`inline-block rounded px-1.5 py-0.5 font-semibold text-[10px] ${t.result === 'TP' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                                : t.result === 'SL' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                                                    : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                                                                }`}>{t.result}</span>
                                                        ) : <span className="text-gray-300">—</span>}
                                                    </td>
                                                    <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                                                        {t.rrObtained != null && t.rrObtained !== 0 ? `${t.rrObtained}R` : '—'}
                                                    </td>
                                                    <td className={`px-3 py-2 font-bold tabular-nums ${pnlPos ? 'text-green-600' : 'text-red-500'}`}>
                                                        {pnlPos ? '+' : ''}{t.pnl.toFixed(2)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                {parsed.length > 20 && (
                                    <div className="px-4 py-2 text-xs text-gray-400 bg-gray-50 dark:bg-gray-700/30 text-center">
                                        … y {parsed.length - 20} trades más
                                    </div>
                                )}
                            </div>

                            <div className="mb-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 px-4 py-3 text-xs text-amber-700 dark:text-amber-400">
                                <strong>Nota:</strong> Los precios de entrada y salida generalmente no están en Notion, podrás completarlos desde la tabla si los necesitas para otros cálculos.
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep('upload')}
                                    className="flex-1 cursor-pointer rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    Subir otro archivo
                                </button>
                                <button
                                    onClick={handleImport}
                                    className="flex-1 cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-500 hover:shadow-md"
                                >
                                    <CheckIcon className="h-4 w-4" />
                                    Importar {parsed.length} trade{parsed.length !== 1 ? 's' : ''}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

