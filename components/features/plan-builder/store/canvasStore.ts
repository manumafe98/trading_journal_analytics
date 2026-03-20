import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BlockType = 
  | 'perfilTrader' 
  | 'metas' 
  | 'gestionMonetaria' 
  | 'estrategias' 
  | 'gestionTrade' 
  | 'sesiones' 
  | 'entradas' 
  | 'reglasGenerales' 
  | 'procesoRevision' 
  | 'objetivos' 
  | 'reglaEstrategia' 
  | 'checklistPreSesion' 
  | 'learning' 
  | 'preguntasIteraciones' 
  | 'cover' 
  | 'watchlist' 
  | 'journalEntry';

export interface Block {
  id: string;
  type: BlockType;
  grid: {
    col: number;   // 1-indexed
    row: number;   // 1-indexed
    cols: number;  // span
    rows: number;  // span
  };
  data: Record<string, unknown>;
  settings?: {
    accentColor?: string;
    label?: string;
    showInPDF?: boolean;
  };
}

export interface CanvasState {
  id: string;
  name: string;
  version: string;
  gridCols: 4 | 6;
  blocks: Block[];
  history: Block[][];
  historyIndex: number;
  
  // Actions
  addBlock: (block: Block) => void;
  updateBlockData: (id: string, data: Record<string, unknown>) => void;
  updateBlockGrid: (id: string, grid: Block['grid']) => void;
  updateBlockSettings: (id: string, settings: Record<string, unknown>) => void;
  removeBlock: (id: string) => void;
  undo: () => void;
  redo: () => void;
  loadCanvas: (data: Partial<CanvasState>) => void;
}

const pushHistory = (state: CanvasState, newBlocks: Block[]) => {
  const currentHistory = state.history.slice(0, state.historyIndex + 1);
  return {
    blocks: newBlocks,
    history: [...currentHistory, newBlocks],
    historyIndex: currentHistory.length,
  };
};

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set) => ({
      id: 'default-canvas',
      name: 'Mi Trading Plan v1.0',
      version: '1.0',
      gridCols: 4,
      blocks: [
        {
          id: 'cover',
          type: 'cover',
          grid: { col: 1, row: 1, cols: 4, rows: 4 },
          data: {
            title: 'TRADING PLAN',
            version: '2.0',
            lastRevision: 'MARZO 2026',
            stats: [
              { label: 'P&L Total', value: '+$4,250.00' },
              { label: 'Ratio de Acierto', value: '68%' },
              { label: 'Promedio R:R', value: '1.5' },
              { label: 'Mejor Estrategia', value: 'BLUE' },
            ],
          },
        },
        {
          id: 'perfil',
          type: 'perfilTrader',
          grid: { col: 1, row: 5, cols: 2, rows: 2 },
          data: {
            rows: [
              { key: 'Estilo', value: 'Conservador · Moderado' },
              { key: 'Tipo Actual', value: 'Day Trader' },
              { key: 'Mercado', value: 'Forex' },
            ],
          },
        },
        {
          id: 'metas',
          type: 'metas',
          grid: { col: 3, row: 5, cols: 2, rows: 2 },
          data: {
            items: [
              { text: 'Fondeo: MyFundedFX + Topstep', bullet: 'arrow' },
              { text: 'Consistencia: rentabilidad y libertad horaria', bullet: 'arrow' },
            ],
          },
        },
      ],
      history: [[]],
      historyIndex: 0,

      addBlock: (block) =>
        set((state) => pushHistory(state, [...state.blocks, block])),

      updateBlockData: (id, data) =>
        set((state) => {
          const newBlocks = state.blocks.map((b) =>
            b.id === id ? { ...b, data: { ...b.data, ...data } } : b
          );
          return pushHistory(state, newBlocks);
        }),

      updateBlockGrid: (id, grid) =>
        set((state) => {
          const newBlocks = state.blocks.map((b) =>
            b.id === id ? { ...b, grid: { ...b.grid, ...grid } } : b
          );
          return pushHistory(state, newBlocks);
        }),
        
      updateBlockSettings: (id, settings) =>
        set((state) => {
          const newBlocks = state.blocks.map((b) =>
            b.id === id ? { ...b, settings: { ...b.settings, ...settings } } : b
          );
          return pushHistory(state, newBlocks);
        }),

      removeBlock: (id) =>
        set((state) => {
          const newBlocks = state.blocks.filter((b) => b.id !== id);
          return pushHistory(state, newBlocks);
        }),

      undo: () =>
        set((state) => {
          if (state.historyIndex > 0) {
            return {
              historyIndex: state.historyIndex - 1,
              blocks: state.history[state.historyIndex - 1],
            };
          }
          return state;
        }),

      redo: () =>
        set((state) => {
          if (state.historyIndex < state.history.length - 1) {
            return {
              historyIndex: state.historyIndex + 1,
              blocks: state.history[state.historyIndex + 1],
            };
          }
          return state;
        }),
        
      loadCanvas: (data) =>
        set((state) => ({
          ...state,
          ...data,
          history: data.blocks ? [data.blocks] : state.history,
          historyIndex: 0,
        })),
    }),
    {
      name: 'trading-plan-builder-storage',
      partialize: (state) => ({
        id: state.id,
        name: state.name,
        version: state.version,
        gridCols: state.gridCols,
        blocks: state.blocks,
      }),
    }
  )
);
