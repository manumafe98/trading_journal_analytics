'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useCanvasStore, Block } from '../store/canvasStore';
import { BlockRenderer } from './BlockRenderer';
import { BLOCK_DEFINITIONS } from '../blocks/definitions';
import { MoreHorizontal, Trash2, Copy, Move, Maximize2 } from 'lucide-react';

const GRID_ROW_HEIGHT = 80;
const GRID_GAP = 12;

export const Canvas: React.FC = () => {
  const { blocks, gridCols, addBlock, updateBlockGrid, removeBlock } = useCanvasStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.data.current?.type === 'library-item') {
      const definition = active.data.current.definition;
      // Simple placement logic: find next available row or just place at bottom
      const lastBlock = blocks.length > 0 ? blocks.reduce((prev, current) => (prev.grid.row > current.grid.row ? prev : current)) : null;
      const nextRow = lastBlock ? lastBlock.grid.row + lastBlock.grid.rows : 1;

      addBlock({
        id: `block-${Date.now()}`,
        type: definition.type,
        grid: {
          col: 1,
          row: nextRow,
          cols: definition.defaultCols,
          rows: definition.defaultRows,
        },
        data: definition.defaultData,
      });
    }

    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div 
        className="relative grid w-full gap-3 p-4 min-h-[800px] transition-all bg-gray-50/50 dark:bg-black/20 rounded-2xl"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gridAutoRows: `${GRID_ROW_HEIGHT}px`,
        }}
      >
        {/* Grid Background Guides */}
        <div className="absolute inset-0 pointer-events-none grid"
          style={{
            gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
            gridAutoRows: `${GRID_ROW_HEIGHT}px`,
            gap: `${GRID_GAP}px`,
            padding: '16px',
          }}
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="border border-gray-200/40 dark:border-white/5 rounded-lg" />
          ))}
        </div>

        {blocks.map((block) => (
          <div
            key={block.id}
            className="group relative rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:border-primary/50 hover:shadow-lg dark:border-white/5 dark:bg-black/60 dark:hover:border-primary/30"
            style={{
              gridColumn: `${block.grid.col} / span ${block.grid.cols}`,
              gridRow: `${block.grid.row} / span ${block.grid.rows}`,
            }}
          >
            {/* Block Header/Toolbar */}
            <div className="absolute -top-3 right-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 z-20">
              <div className="flex items-center gap-px rounded-full bg-white px-1.5 py-1 shadow-md border border-gray-100 dark:bg-neutral-900 dark:border-white/10">
                <button 
                  onClick={() => removeBlock(block.id)}
                  className="rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
                <div className="w-px h-3 bg-gray-100 dark:bg-white/10 mx-1" />
                <button className="rounded-full p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                  <MoreHorizontal className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="flex h-full flex-col overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-50 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-neon-glow" />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">
                    {BLOCK_DEFINITIONS[block.type]?.label || block.type}
                  </span>
                </div>
                <Move className="h-3 w-3 text-gray-300 cursor-move" />
              </div>
              
              <div className="flex-1 overflow-auto p-3">
                <BlockRenderer block={block} />
              </div>

              {/* Resize Handle (Simulation) */}
              <div className="absolute bottom-1 right-1 cursor-nwse-resize opacity-0 group-hover:opacity-100">
                <Maximize2 className="h-3 w-3 text-gray-300 rotate-90" />
              </div>
            </div>
          </div>
        ))}

        <DragOverlay>
          {activeId && activeId.startsWith('library-') ? (
            <div className="flex items-center gap-3 rounded-xl border border-primary bg-white/90 p-3 shadow-2xl backdrop-blur-sm dark:bg-black/80">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <PlusIcon className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                Soltar para agregar
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);
