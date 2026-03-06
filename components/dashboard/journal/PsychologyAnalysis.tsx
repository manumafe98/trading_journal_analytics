'use client';

import { useState } from 'react';
import { Brain, AlertCircle, Loader2, Key, Sparkles, RefreshCcw } from 'lucide-react';
import type { Trade, Account } from '@/lib/journal/types';
import { SettingsModal } from '../SettingsModal';

interface Props {
    trades: Trade[];
    account: Account;
    onSaveProfile: (profile: string) => void;
}

export function PsychologyAnalysis({ trades, account, onSaveProfile }: Props) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    // Show the stored profile initially if it exists
    const [result, setResult] = useState<string | null>(account.psychologicalProfile || null);
    const [error, setError] = useState<string | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleAnalyze = async () => {
        const apiKey = localStorage.getItem('gemini_api_key');
        if (!apiKey) {
            setError('need_key');
            return;
        }

        const tradesWithNotes = trades.filter(t => t.journalNotes && t.journalNotes.trim().length > 0);

        if (tradesWithNotes.length === 0) {
            setError('no_notes');
            return;
        }

        setError(null);
        setIsAnalyzing(true);

        // Format data for the prompt
        const formattedData = tradesWithNotes.map(t => {
            const pnlStr = t.pnl ? `${t.pnl > 0 ? '+' : ''}${t.pnl.toFixed(2)}` : 'N/A';
            return `[Trade ${t.symbol || 'N/A'}] - Resultado PnL: ${pnlStr}
Notas: "${t.journalNotes}"`;
        }).join('\n\n');

        const existingProfileContext = account.psychologicalProfile
            ? `\n\nEste es tu análisis previo:\n"""\n${account.psychologicalProfile}\n"""\n\nTu tarea es ACTUALIZAR estas conclusiones con la nueva información. Sé extremadamente breve y directo.`
            : `\n\nTu tarea es extraer las PRIMERAS CONCLUSIONES de este backtesting.`;

        const prompt = `Actúa como un Asistente Analista de Backtesting.
A continuación tienes un registro de operaciones con su resultado numérico y las notas del trader.
${existingProfileContext}

Tu objetivo es sacar conclusiones MATEMÁTICAS, ESTRATÉGICAS y PSICOLÓGICAS claras basadas en las notas.
Reglas estrictas:
1. SÉ MUY BREVE. Usa viñetas cortas. No escribas introducciones largas ni conclusiones redundantes.
2. Busca qué estrategias o gestiones funcionan mejor según los comentarios (Ejemplo: "La gestión de EMA 1m resultó en operaciones ganadoras", "Entrar en contra de tendencia por RR generó X pérdidas").
3. Destaca el error más costoso y el mayor acierto.
4. Usa un tono directo y profesional de analista de datos/trading.

Trades del usuario a analizar:
${formattedData}`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Error communicating with Gemini APIs');
            }

            const data = await response.json();
            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (textResponse) {
                setResult(textResponse);
                onSaveProfile(textResponse); // Persist to global store
            } else {
                throw new Error('Formato de respuesta inválido desde Gemini.');
            }
        } catch (err: unknown) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : String(err);
            if (errorMessage.includes('API_KEY_INVALID')) {
                setError('invalid_key');
            } else {
                setError('fetch_error');
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-md border border-violet-100 dark:border-violet-900/30 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500"></div>

            <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                            <Brain className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-gray-50 text-lg flex items-center gap-2">
                                Asistente de Conclusiones IA <Sparkles className="w-4 h-4 text-orange-400" />
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                La IA saca conclusiones cortas y directas de tus notas de backtesting.
                            </p>
                        </div>
                    </div>

                    {!isAnalyzing && (
                        <button
                            onClick={handleAnalyze}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-violet-700 hover:-translate-y-0.5"
                        >
                            {result ? <><RefreshCcw className="w-4 h-4" /> Actualizar Conclusiones</> : 'Generar Conclusiones'}
                        </button>
                    )}
                </div>

                {isAnalyzing && (
                    <div className="flex flex-col items-center justify-center py-10 gap-4">
                        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                        <p className="text-sm text-gray-500 font-medium">Leyendo mente del trader...</p>
                    </div>
                )}

                {error === 'need_key' && (
                    <div className="rounded-xl bg-orange-50 dark:bg-orange-900/20 p-4 border border-orange-100 dark:border-orange-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <Key className="h-5 w-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-orange-800 dark:text-orange-200">
                                Para usar esta función gratuita, necesitas configurar tu clave de Gemini API que queda guardada localmente en tu navegador.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="whitespace-nowrap rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition"
                        >
                            Configurar Clave
                        </button>
                    </div>
                )}

                {error === 'invalid_key' && (
                    <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-100 dark:border-red-800/50 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-red-800 dark:text-red-200">Clave API Inválida</p>
                            <p className="text-sm text-red-700/80 dark:text-red-300/80">
                                Asegúrate de haber copiado la clave correctamente desde Google AI Studio.
                            </p>
                            <button
                                onClick={() => setIsSettingsOpen(true)}
                                className="mt-2 text-sm text-red-600 dark:text-red-400 underline"
                            >
                                Cambiar Clave
                            </button>
                        </div>
                    </div>
                )}

                {error === 'no_notes' && (
                    <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-100 dark:border-gray-700 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Aún no hay suficiente información analizable. Por favor ve al Registro de Trades e ingresa <strong>Notas de Diario</strong> en varias de tus operaciones para que la IA pueda encontrar patrones.
                        </p>
                    </div>
                )}

                {error === 'fetch_error' && (
                    <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-100 dark:border-red-800/50 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800 dark:text-red-200">
                            Hubo un error de conexión con la IA. Inténtalo de nuevo más tarde.
                        </p>
                    </div>
                )}

                {result && !isAnalyzing && (
                    <div className="prose prose-sm dark:prose-invert prose-violet max-w-none mt-4 rounded-xl bg-violet-50/50 dark:bg-violet-900/10 p-5 border border-violet-100 dark:border-violet-800/30">
                        {/* Render simple markdown layout */}
                        {result.split('\n').map((line, i) => {
                            if (line.trim().startsWith('##')) return <h3 key={i} className="font-bold text-violet-900 dark:text-violet-100 mt-4 mb-2">{line.replace(/#/g, '')}</h3>;
                            if (line.trim().startsWith('#')) return <h2 key={i} className="font-bold text-violet-900 dark:text-violet-100 mt-4 mb-2">{line.replace(/#/g, '')}</h2>;
                            if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) return <li key={i} className="ml-4 list-disc text-gray-700 dark:text-gray-300">{line.substring(2)}</li>;
                            if (line.trim() === '') return <br key={i} />;
                            // Render bold text manually
                            const formattedLine = line.split(/(\*\*.*?\*\*)/).map((part, index) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                    return <strong key={index} className="font-bold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>;
                                }
                                return part;
                            });
                            return <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">{formattedLine}</p>;
                        })}
                    </div>
                )}
            </div>

            {isSettingsOpen && (
                <SettingsModal onClose={() => setIsSettingsOpen(false)} />
            )}
        </div>
    );
}
