'use client';

import { useState, useEffect } from 'react';
import { X, Key, Info, ExternalLink, Save } from 'lucide-react';
import { createPortal } from 'react-dom';

interface Props {
    onClose: () => void;
}

export function SettingsModal({ onClose }: Props) {
    const [apiKey, setApiKey] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load existing key
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) {
            setApiKey(savedKey);
        }

        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleSave = () => {
        if (apiKey.trim()) {
            localStorage.setItem('gemini_api_key', apiKey.trim());
        } else {
            localStorage.removeItem('gemini_api_key');
        }
        onClose();
    };

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-2xl flex flex-col animate-fade-in-up border border-gray-100 dark:border-gray-700/50">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 p-5 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                            <Key className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">
                                Configuración de IA
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Claves de acceso locales (Seguro)
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
                <div className="flex flex-col p-5 gap-6">
                    <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-100 dark:border-blue-800/50">
                        <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-800 dark:text-blue-200">
                                <p className="font-semibold mb-1">Privacidad Absoluta</p>
                                <p className="text-blue-700/80 dark:text-blue-300/80 text-xs">
                                    Tu clave se guarda <strong>únicamente en tu navegador</strong> (localStorage). No pasa por ningún servidor intermedio, las consultas van directo de tu computadora a Google.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            Google Gemini API Key
                        </label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="AIzaSy..."
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                        />
                        <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 hover:underline mt-1 w-fit"
                        >
                            Obtener clave gratuita de Gemini <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 p-4 shrink-0 flex justify-end gap-3 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 rounded-xl bg-gray-900 dark:bg-gray-100 px-5 py-2.5 text-sm font-semibold text-white dark:text-gray-900 shadow-md transition-all hover:bg-gray-800 dark:hover:bg-white hover:-translate-y-0.5 cursor-pointer"
                    >
                        <Save className="h-4 w-4" />
                        Guardar Clave
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
