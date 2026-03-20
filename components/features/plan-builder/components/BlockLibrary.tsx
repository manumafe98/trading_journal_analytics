'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { BLOCK_DEFINITIONS, BlockDefinition } from '../blocks/definitions';
import * as LucideIcons from 'lucide-react';

interface LibraryBlockProps {
  definition: BlockDefinition;
}

const LibraryBlock: React.FC<LibraryBlockProps> = ({ definition }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `library-${definition.type}`,
    data: {
      type: 'library-item',
      definition,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as Record<string, any>)[definition.icon] || LucideIcons.FileText;

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex cursor-grab items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all hover:border-primary/50 hover:shadow-md active:cursor-grabbing dark:border-white/5 dark:bg-black/40 dark:hover:border-primary/30"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-400 dark:bg-white/5">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
          {definition.label}
        </span>
        <span className="text-[10px] text-gray-500 truncate">
          {definition.defaultCols}×{definition.defaultRows} Grid
        </span>
      </div>
    </div>
  );
};

export const BlockLibrary: React.FC = () => {
  // Group blocks by category for better UX
  const groups = [
    { name: 'Identidad', items: ['cover', 'perfilTrader', 'metas'] },
    { name: 'Operativa', items: ['gestionMonetaria', 'estrategias', 'sesiones', 'entradas'] },
    { name: 'Reglas & Procesos', items: ['reglasGenerales', 'procesoRevision', 'objetivos', 'reglaEstrategia'] },
    { name: 'Psicología & Otros', items: ['checklistPreSesion', 'learning', 'preguntasIteraciones', 'watchlist', 'journalEntry'] },
  ];

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-lg font-bold text-gray-950 dark:text-white">Bloques</h2>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Arrastra para agregar</p>
      </div>

      <div className="flex flex-col gap-8">
        {groups.map((group) => (
          <div key={group.name} className="flex flex-col gap-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 flex items-center gap-2">
              <span className="h-px flex-1 bg-gray-100 dark:bg-white/5" />
              {group.name}
              <span className="h-px flex-1 bg-gray-100 dark:bg-white/5" />
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {group.items.map((key) => (
                <LibraryBlock key={key} definition={BLOCK_DEFINITIONS[key as import('../store/canvasStore').BlockType]} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
