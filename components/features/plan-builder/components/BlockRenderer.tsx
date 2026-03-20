'use client';

import React from 'react';
import { Block } from '../store/canvasStore';
import { 
  ArrowRight, 
  X, 
  Check, 
  AlertCircle, 
  Minus,
  Bell,
  BellOff
} from 'lucide-react';

// BlockRendererProps is used for better typing
interface BlockRendererProps {
  block: Block;
}

interface PerfilRow {
  key: string;
  value: string;
}

interface MetaItem {
  text: string;
  bullet: string;
}

interface MonetariaRow {
  modality: string;
  risk: string;
  max: string;
}

interface EstrategiaRow {
  name: string;
  status: string;
  tp: string;
}

interface SesionItem {
  label: string;
  value: string;
}

interface StatItem {
  label: string;
  value: string;
}

interface WatchlistItem {
  ticker: string;
  rationale: string;
  alert: boolean;
}

interface ChecklistItem {
  checked: boolean;
  text: string;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block }) => {
  const { type } = block;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = block.data as Record<string, any>;

  const renderBullet = (type: string) => {
    switch (type) {
      case 'arrow': return <ArrowRight className="h-3 w-3 text-primary shrink-0 transition-transform group-hover:translate-x-0.5" />;
      case 'x': return <X className="h-3 w-3 text-red-500 shrink-0" />;
      case 'check': return <Check className="h-3 w-3 text-green-500 shrink-0" />;
      case 'warn': return <AlertCircle className="h-3 w-3 text-yellow-500 shrink-0" />;
      default: return <Minus className="h-3 w-3 text-gray-400 shrink-0" />;
    }
  };

  switch (type) {
    case 'perfilTrader':
      return (
        <div className="space-y-1.5 p-1">
          {(data.rows as PerfilRow[])?.map((row, i) => (
            <div key={i} className="flex items-baseline justify-between gap-4 border-b border-gray-100 pb-1 last:border-0 dark:border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">{row.key}</span>
              <span className="text-right text-xs font-medium text-gray-700 dark:text-gray-200">{row.value}</span>
            </div>
          ))}
        </div>
      );

    case 'metas':
    case 'gestionTrade':
    case 'entradas':
    case 'reglasGenerales':
    case 'objetivos':
      return (
        <div className="space-y-2 p-1">
          {(data.items as MetaItem[])?.map((item, i) => (
            <div key={i} className="group flex items-start gap-2 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
              {renderBullet(item.bullet)}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      );

    case 'gestionMonetaria':
      return (
        <div className="p-1">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5">
                <th className="pb-2 font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Modalidad</th>
                <th className="pb-2 font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Riesgo</th>
                <th className="pb-2 font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Simultáneos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {(data.table as MonetariaRow[])?.map((row, i) => (
                <tr key={i}>
                  <td className="py-2 font-medium dark:text-gray-200">{row.modality}</td>
                  <td className="py-2 text-primary">{row.risk}</td>
                  <td className="py-2 text-gray-500">{row.max}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.alert && (
            <div className="mt-3 flex gap-2 rounded-md border-l-2 border-yellow-500 bg-yellow-500/5 p-2 text-[10px] text-yellow-600 dark:text-yellow-400">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>{data.alert as string}</span>
            </div>
          )}
        </div>
      );

    case 'estrategias':
      return (
        <div className="p-1">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 text-[9px]">
                <th className="pb-2 font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Estrategia</th>
                <th className="pb-2 font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Estado</th>
                <th className="pb-2 font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {(data.table as EstrategiaRow[])?.map((row, i) => (
                <tr key={i}>
                  <td className="py-2 font-medium dark:text-gray-200">{row.name}</td>
                  <td className="py-2">
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                      row.status === 'active' 
                        ? 'bg-green-500/10 text-green-500' 
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {row.status === 'active' ? 'Activa' : 'Proceso'}
                    </span>
                  </td>
                  <td className="py-2 text-gray-500">{row.tp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'sesiones':
      return (
        <div className="grid grid-cols-1 gap-2 p-1">
          {(data.items as SesionItem[])?.map((item, i) => (
            <div key={i} className="rounded-lg bg-gray-50/50 p-2 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{item.label}</span>
              <span className="mt-0.5 block text-xs font-medium text-gray-700 dark:text-gray-200">{item.value}</span>
            </div>
          ))}
        </div>
      );

    case 'cover':
      return (
        <div className="flex h-full flex-col items-center justify-center space-y-8 py-8">
          <div className="text-center space-y-2">
            <h1 className="font-display text-5xl font-black tracking-tighter text-gray-900 dark:text-white">
              {data.title as string}
            </h1>
            <p className="font-mono text-sm tracking-[0.3em] font-medium text-primary">
              VERSION {data.version as string} · {data.lastRevision as string}
            </p>
          </div>
          <div className="grid w-full grid-cols-2 gap-4 max-w-2xl">
            {(data.stats as StatItem[])?.map((stat, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-white/50 p-6 text-center shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-black/40">
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{stat.label}</span>
                <span className="mt-2 block font-display text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'preguntasIteraciones':
      return (
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 p-1">
          {(data.questions as string[])?.map((q, i) => (
            <div key={i} className="flex gap-3 text-[11px] leading-relaxed group">
              <span className="font-mono font-bold text-gray-300 dark:text-gray-600">{(i + 1).toString().padStart(2, '0')}</span>
              <span className="text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors cursor-text">{q}</span>
            </div>
          ))}
        </div>
      );

    case 'watchlist':
      return (
        <div className="space-y-2 p-1">
          {(data.items as WatchlistItem[])?.map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/30 p-2 dark:border-white/5 dark:bg-white/5">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900 dark:text-white">{item.ticker}</span>
                <span className="text-[10px] text-gray-500">{item.rationale}</span>
              </div>
              <div className="shrink-0">
                {item.alert ? <Bell className="h-3 w-3 text-primary" /> : <BellOff className="h-3 w-3 text-gray-400" />}
              </div>
            </div>
          ))}
        </div>
      );

    case 'checklistPreSesion':
      return (
        <div className="space-y-3 p-1">
          {(data.items as ChecklistItem[])?.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`h-4 w-4 rounded border transition-colors ${
                item.checked 
                  ? 'bg-primary border-primary text-gray-950' 
                  : 'border-gray-300 dark:border-white/20'
              } flex items-center justify-center shrink-0`}>
                {item.checked && <Check className="h-3 w-3 stroke-[3]" />}
              </div>
              <span className={`text-xs ${item.checked ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      );

    default:
      return <div className="text-[10px] text-gray-400">Renderer for {type} coming soon...</div>;
  }
};
