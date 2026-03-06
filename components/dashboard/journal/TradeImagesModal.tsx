'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    X, UploadCloudIcon, Image as ImageIcon,
    Trash2Icon, ExternalLinkIcon, Maximize2Icon
} from 'lucide-react';
import type { Trade } from '@/lib/journal/types';
import { compressImageToBase64 } from '@/lib/journal/imageUtils';

interface Props {
    trade: Trade;
    onClose: () => void;
    onSave: (images: string[]) => void;
}

export function TradeImagesModal({ trade, onClose, onSave }: Props) {
    const [images, setImages] = useState<string[]>(trade.images || []);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        setIsProcessing(true);
        try {
            const newImages: string[] = [];
            // Limit to max 5 new images at a time to avoid blocking thread too long
            const maxFiles = Math.min(files.length, 5);

            for (let i = 0; i < maxFiles; i++) {
                const file = files[i];
                if (!file.type.startsWith('image/')) continue;

                // Compress image to base64
                const base64 = await compressImageToBase64(file, 1080);
                newImages.push(base64);
            }

            if (newImages.length > 0) {
                const updated = [...images, ...newImages];
                setImages(updated);
                onSave(updated); // auto-save on add
            }
        } catch (error) {
            console.error('Error processing images:', error);
            alert('Hubo un error al procesar las imágenes. Intenta con un formato diferente o imágenes más pequeñas.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    }, [images]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleDelete = (indexToDelete: number) => {
        const updated = images.filter((_, idx) => idx !== indexToDelete);
        setImages(updated);
        onSave(updated); // auto-save on delete
    };

    const openExpanded = (src: string) => {
        setExpandedImage(src);
    };

    const closeExpanded = () => {
        setExpandedImage(null);
    };

    // Render portal only on client
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
            {/* Expanded Fullscreen View */}
            {expandedImage && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4"
                    onClick={closeExpanded}
                >
                    <button
                        onClick={closeExpanded}
                        className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all cursor-pointer"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={expandedImage}
                        alt="Trade Fullscreen"
                        className="max-h-full max-w-full object-contain rounded-lg animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            {/* Main Modal */}
            <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-gray-800 shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 p-5 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                            <ImageIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">
                                Registro Visual de {trade.symbol || 'Trade'}
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(trade.entryDate + 'T00:00:00').toLocaleDateString()} · {trade.side}
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

                    {/* Drag and drop zone */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative mb-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-8 px-4 text-center transition-all ${isDragging
                            ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10'
                            : 'border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => handleFiles(e.target.files)}
                            className="hidden"
                            accept="image/*"
                            multiple
                        />
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                            {isProcessing ? (
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                            ) : (
                                <UploadCloudIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                            )}
                        </div>
                        <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                            {isProcessing ? 'Procesando imágenes...' : 'Arrastrá tus imágenes acá'}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">
                            O haz click en el botón de abajo. Las imágenes serán optimizadas automáticamente para ahorrar espacio.
                        </p>

                        {!isProcessing && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="mt-4 cursor-pointer rounded-lg bg-gray-900 dark:bg-gray-100 px-4 py-2 text-xs font-semibold text-white dark:text-gray-900 shadow-sm transition-all hover:bg-gray-800 dark:hover:bg-white hover:-translate-y-0.5"
                            >
                                Seleccionar Fotos
                            </button>
                        )}
                    </div>

                    {/* Gallery */}
                    <div className="flex-1">
                        <div className="mb-3 flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Galería Adjunta ({images.length})
                            </h4>
                        </div>

                        {images.length === 0 ? (
                            <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center">
                                <ImageIcon className="mb-2 h-6 w-6 text-gray-300 dark:text-gray-600" />
                                <span className="text-xs text-gray-400 dark:text-gray-500">Sin imágenes adjuntas</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {images.map((src, idx) => (
                                    <div
                                        key={idx}
                                        className="group relative aspect-video w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/80 shadow-sm"
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={src}
                                            alt={`Trade evidence ${idx + 1}`}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />

                                        {/* Overlay controls */}
                                        <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                                            <button
                                                onClick={() => openExpanded(src)}
                                                className="cursor-pointer rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition-all hover:bg-white/40 hover:scale-110"
                                                title="Expandir"
                                            >
                                                <Maximize2Icon className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(idx)}
                                                className="cursor-pointer rounded-full bg-red-500/80 p-2 text-white backdrop-blur-md transition-all hover:bg-red-500 hover:scale-110"
                                                title="Eliminar"
                                            >
                                                <Trash2Icon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 p-4 shrink-0 flex justify-end">
                    <button
                        onClick={onClose}
                        className="rounded-xl bg-gray-900 dark:bg-gray-100 px-5 py-2.5 text-sm font-semibold text-white dark:text-gray-900 shadow-md transition-all hover:bg-gray-800 dark:hover:bg-white cursor-pointer"
                    >
                        Listo
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
