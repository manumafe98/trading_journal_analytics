'use client';

import React from 'react';
import { useCanvasStore } from '../store/canvasStore';
import { 
  Undo2, 
  Redo2, 
  Download, 
  Save, 
  Settings, 
  Eye, 
  Grid3X3,
  FileJson
} from 'lucide-react';

export const BuilderToolbar: React.FC = () => {
  const { undo, redo, historyIndex, history, blocks, name } = useCanvasStore();

  const handleExportJSON = () => {
    const data = {
      name,
      blocks,
      version: '1.0',
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trading-plan-${name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
  };

  return (
    <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur-md dark:border-white/5 dark:bg-black/40">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <h1 className="font-display text-base font-bold text-gray-900 dark:text-white leading-tight">
            {name}
          </h1>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500">Auto-grabado</span>
          </div>
        </div>

        <div className="h-8 w-px bg-gray-100 dark:bg-white/5 mx-2" />

        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-30 dark:text-gray-400 dark:hover:bg-white/5"
            title="Deshacer (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-30 dark:text-gray-400 dark:hover:bg-white/5"
            title="Rehacer (Shift+Ctrl+Z)"
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-xl bg-gray-100/50 p-1 dark:bg-white/5">
          <button className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-gray-900 shadow-sm dark:bg-neutral-800 dark:text-white">
            <Grid3X3 className="h-3.5 w-3.5 text-primary" />
            Editar
          </button>
          <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <Eye className="h-3.5 w-3.5" />
            Vista Previa
          </button>
        </div>

        <div className="h-8 w-px bg-gray-100 dark:bg-white/5 mx-1" />

        <button 
          onClick={handleExportJSON}
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
          title="Exportar JSON"
        >
          <FileJson className="h-4 w-4" />
        </button>

        <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-gray-950 shadow-neon-glow transition-all hover:scale-105 active:scale-95">
          <Download className="h-4 w-4 stroke-[2.5]" />
          Exportar PDF
        </button>
      </div>
    </div>
  );
};
