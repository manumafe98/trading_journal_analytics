'use client';

import { useEffect } from 'react';
import { PsicoEntry } from '@/data/analytics/types';
import { PsicoEntryForm } from './PsicoEntryForm';
import { format } from 'date-fns';

interface PsicoEntryModalProps {
  entry: PsicoEntry;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<PsicoEntry>) => void;
  onDelete: (id: string) => void;
}

export function PsicoEntryModal({ entry, isOpen, onClose, onUpdate, onDelete }: PsicoEntryModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const dateObj = new Date(entry.createdAt);
  const createdStr = isNaN(dateObj.getTime()) ? 'Unknown' : format(dateObj, 'MMM d, yyyy HH:mm');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-4xl max-h-full flex flex-col rounded-2xl bg-white shadow-2xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        
        <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800">
          <div>
             <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
               Edit Journal Entry
             </h2>
             <span className="text-xs text-gray-500 dark:text-gray-400">Created At: {createdStr}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if(confirm('Are you sure you want to delete this specific entry? This action cannot be undone.')) {
                  onDelete(entry.id);
                  onClose();
                }
              }}
              className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <PsicoEntryForm 
            initialData={entry} 
            onSubmit={(data) => {
              onUpdate(entry.id, data);
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
