'use client';

import React from 'react';
import { BuilderToolbar } from './components/BuilderToolbar';
import { BlockLibrary } from './components/BlockLibrary';
import { Canvas } from './components/Canvas';

export const BuilderPage: React.FC = () => {
  return (
    <div className="flex h-[calc(100vh-theme(spacing.32))] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/5 dark:bg-neutral-950">
      {/* Top Toolbar */}
      <BuilderToolbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Block Library */}
        <div className="w-72 border-r border-gray-100 bg-gray-50/30 dark:border-white/5 dark:bg-black/20 overflow-y-auto custom-scrollbar">
          <BlockLibrary />
        </div>

        {/* Main Area: Canvas */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-neutral-900/50 p-6 custom-scrollbar">
          <div className="mx-auto max-w-[1200px]">
            <Canvas />
          </div>
        </div>

        {/* Right Sidebar: Contextual Editor (Placeholder) */}
        <div className="w-64 border-l border-gray-100 bg-gray-50/30 dark:border-white/5 dark:bg-black/20 p-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Configuración</h2>
            <div className="rounded-xl border border-gray-100 border-dashed p-8 text-center dark:border-white/10">
              <span className="text-[11px] text-gray-400">Selecciona un bloque para editar sus propiedades</span>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
};
