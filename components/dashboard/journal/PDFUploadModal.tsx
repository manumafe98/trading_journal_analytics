'use client';

import { useState, useCallback, useRef } from 'react';
import { XIcon, UploadIcon, FileTextIcon, CheckIcon, AlertCircleIcon, Loader2Icon } from 'lucide-react';
import { parsePDFToTrade } from '@/lib/journal/pdfParser';
import type { Trade } from '@/lib/journal/types';

interface Props {
    accountId: string;
    onImport: (trade: Omit<Trade, 'id'>) => void;
    onClose: () => void;
}

type Step = 'upload' | 'parsing' | 'preview' | 'error';

const FIELD_LABELS: Record<string, string> = {
    symbol: 'Par / Divisa',
    side: 'Dirección',
    entryDate: 'Fecha',
    pnl: 'P&L (USD)',
    riskUsd: 'Riesgo (USD)',
    riskPercent: 'Riesgo (%)',
    rrObtained: 'RR obtenido',
    result: 'Resultado',
    strategy: 'Estrategia',
    style: 'Estilo',
    session: 'Sesión',
    feelingNotes: '¿Cómo me siento?',
    errorNotes: 'Errores / Revisión',
    executionNotes: 'Ejecución',
};

export function PDFUploadModal({ accountId, onImport, onClose }: Props) {
    const [step, setStep] = useState<Step>('upload');
    const [errorMsg, setErrorMsg] = useState('');
    const [parsed, setParsed] = useState<Omit<Trade, 'id'> | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const processFile = async (file: File) => {
        if (!file.name.endsWith('.pdf')) {
            setErrorMsg('El archivo debe ser un PDF.');
            setStep('error');
            return;
        }
        setStep('parsing');
        try {
            const trade = await parsePDFToTrade(file, accountId);
            setParsed(trade);
            setStep('preview');
        } catch (e) {
            setErrorMsg(`Error al leer el PDF: ${e instanceof Error ? e.message : String(e)}`);
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
        [accountId],
    );

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleImport = () => {
        if (!parsed) return;
        onImport(parsed);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4 pt-10">
            <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl animate-fade-in-up mb-8">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">Importar Journal PDF</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Exportación de Notion · lectura automática</p>
                    </div>
                    <button onClick={onClose} className="cursor-pointer rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <XIcon className="h-5 w-5" />
                    </button>
                </div>

                <div className="px-6 py-5">
                    {/* STEP: upload */}
                    {step === 'upload' && (
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
                            <input ref={inputRef} type="file" accept=".pdf" onChange={onFileChange} className="hidden" />
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-900/30">
                                <UploadIcon className="h-7 w-7 text-primary-500" />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-gray-800 dark:text-gray-200">Arrastrá tu PDF aquí</p>
                                <p className="text-sm text-gray-400 mt-1">o hacé click para seleccionar el archivo</p>
                            </div>
                            <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs text-gray-500 dark:text-gray-400">
                                Solo archivos .pdf de Notion
                            </span>
                        </div>
                    )}

                    {/* STEP: parsing */}
                    {step === 'parsing' && (
                        <div className="flex flex-col items-center justify-center gap-4 py-16">
                            <Loader2Icon className="h-10 w-10 animate-spin text-primary-500" />
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Leyendo el PDF...</p>
                        </div>
                    )}

                    {/* STEP: error */}
                    {step === 'error' && (
                        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20">
                                <AlertCircleIcon className="h-7 w-7 text-red-500" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-gray-50">No se pudo leer el PDF</p>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{errorMsg}</p>
                            </div>
                            <button
                                onClick={() => setStep('upload')}
                                className="cursor-pointer rounded-xl border border-gray-200 dark:border-gray-600 px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Intentar de nuevo
                            </button>
                        </div>
                    )}

                    {/* STEP: preview */}
                    {step === 'preview' && parsed && (
                        <div>
                            {/* Header */}
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 dark:bg-green-900/20">
                                    <FileTextIcon className="h-5 w-5 text-green-500" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-gray-50">Revisá los datos extraídos</p>
                                    <p className="text-xs text-gray-400">Confirmá antes de importar al dashboard</p>
                                </div>
                            </div>

                            {/* Extracted fields table */}
                            <div className="rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-4">
                                <table className="w-full text-sm">
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                        {Object.entries(FIELD_LABELS).map(([key, label]) => {
                                            const value = (parsed as Record<string, unknown>)[key];
                                            if (value === undefined || value === null || value === '') return null;
                                            return (
                                                <tr key={key} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                    <td className="px-4 py-2.5 text-xs text-gray-500 dark:text-gray-400 font-medium w-36">{label}</td>
                                                    <td className={`px-4 py-2.5 font-medium ${key === 'pnl'
                                                            ? typeof value === 'number' && value >= 0 ? 'text-green-500' : 'text-red-500'
                                                            : 'text-gray-800 dark:text-gray-200'
                                                        }`}>
                                                        {key === 'pnl' && typeof value === 'number'
                                                            ? `${value >= 0 ? '+' : ''}$${value.toFixed(2)}`
                                                            : key === 'riskUsd' && typeof value === 'number'
                                                                ? `$${value.toFixed(2)}`
                                                                : key === 'riskPercent' && typeof value === 'number'
                                                                    ? `${value}%`
                                                                    : key === 'side'
                                                                        ? value === 'Buy' ? '▲ Long (Buy)' : '▼ Short (Sell)'
                                                                        : String(value)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Note about prices */}
                            <div className="mb-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 px-4 py-3 text-xs text-amber-700 dark:text-amber-400">
                                <strong>Nota:</strong> El PDF de Notion no incluye precios de entrada/salida ni cantidad. Podés editarlos desde la tabla de trades después de importar.
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep('upload')}
                                    className="flex-1 cursor-pointer rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    Subir otro PDF
                                </button>
                                <button
                                    onClick={handleImport}
                                    className="flex-1 cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-500 hover:shadow-md"
                                >
                                    <CheckIcon className="h-4 w-4" />
                                    Confirmar e importar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
