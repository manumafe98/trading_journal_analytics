'use client';

import { useEffect, useState } from 'react';
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
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200); // Wait for transition
  };

  if (!isOpen) return null;

  const dateObj = new Date(entry.createdAt);
  const createdStr = isNaN(dateObj.getTime()) ? 'Unknown' : format(dateObj, 'MMMM d, yyyy • h:mm a');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 sm:pb-12">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-gray-900/60 transition-opacity duration-300 backdrop-blur-sm ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleClose}
      />
      
      {/* Modal Card */}
      <div 
        className={`relative w-full max-w-4xl max-h-[95vh] flex flex-col rounded-2xl bg-gray-50 shadow-2xl dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 transition-all duration-300 ease-out ${isClosing ? 'scale-95 opacity-0 translate-y-4' : 'scale-100 opacity-100 translate-y-0'}`}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200/60 p-5 sm:px-8 dark:border-gray-800/60 bg-white dark:bg-gray-900/80 rounded-t-2xl backdrop-blur-md sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 ring-1 ring-primary-500/20">
                ✏️
              </div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Edit Journal Entry
              </h2>
            </div>
            <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400 pl-11">
              Recorded on {createdStr}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => {
                if(confirm('Are you sure you want to delete this specific entry? This action cannot be undone.')) {
                  onDelete(entry.id);
                  onClose(); // instant close on delete
                }
              }}
              className="group flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              <span className="hidden sm:inline">Delete</span>
            </button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>
            <button
              onClick={handleClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              aria-label="Close modal"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 pb-24 sm:pb-8">
          <PsicoEntryForm 
            initialData={entry} 
            onSubmit={(data) => {
              onUpdate(entry.id, data);
              handleClose();
            }}
            onCancel={handleClose}
          />
        </div>
      </div>
    </div>
  );
}
