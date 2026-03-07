'use client';

import { useState } from 'react';
import { PsicoEntry } from '@/data/analytics/types';
import { TradeLinker } from './TradeLinker';

interface PsicoEntryFormProps {
  initialData?: Partial<PsicoEntry>;
  onSubmit: (data: Omit<PsicoEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
}

const emptyForm = {
  linkedTradeId: undefined,
  emotionBeforeChart: '',
  emotionBeforeExecution: '',
  scenarioWaitingFor: '',
  feelingWhileWaiting: '',
  intensityBeforeExecution: 5,
  physicalSensationsBeforeExecution: '',
  emotionDuringTrade: '',
  intensityDuringTrade: 5,
  physicalSensationsDuringTrade: '',
  experiencingHope: '',
  regretBeingInTrade: '',
  emotionAfterTrade: '',
  intensityAfterTrade: 5,
  changedPlan: '',
  physicalSensationsAfterTrade: '',
  whatDidWell: '',
  whatCouldImprove: '',
};

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="border-b border-gray-200 pb-2 mb-4 pt-6 first:pt-0 dark:border-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
    </div>
  );
}

function TextAreaField({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <textarea
        rows={2}
        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function IntensitySlider({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) {
  return (
    <div className="space-y-2">
      <label className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
        <span>{label}</span>
        <span className="text-blue-600 dark:text-blue-400 font-bold">{value} / 10</span>
      </label>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}

export function PsicoEntryForm({ initialData, onSubmit, onCancel }: PsicoEntryFormProps) {
  const [formData, setFormData] = useState({ ...emptyForm, ...initialData });

  const handleChange = (field: keyof typeof emptyForm, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if at least one text field is filled
    const hasContent = Object.entries(formData).some(([key, val]) => 
      typeof val === 'string' && val.trim() !== '' && key !== 'linkedTradeId'
    );
    
    if (!hasContent) {
      alert("Please enter some journal contents before saving.");
      return;
    }

    onSubmit(formData);
    
    if (!initialData) {
      setFormData(emptyForm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* SECTION A */}
      <div>
        <SectionHeader title="Before opening the chart" />
        <TextAreaField 
          label="How am I feeling? (Emotions before opening the chart)" 
          value={formData.emotionBeforeChart} 
          onChange={(v) => handleChange('emotionBeforeChart', v)} 
        />
      </div>

      {/* SECTION C */}
      <div>
        <SectionHeader title="Before executing the trade" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextAreaField 
            label="How am I feeling?" 
            value={formData.emotionBeforeExecution} 
            onChange={(v) => handleChange('emotionBeforeExecution', v)} 
          />
          <TextAreaField 
            label="What scenario am I waiting for?" 
            value={formData.scenarioWaitingFor} 
            onChange={(v) => handleChange('scenarioWaitingFor', v)} 
          />
          <TextAreaField 
            label="What do I feel while waiting? Why?" 
            value={formData.feelingWhileWaiting} 
            onChange={(v) => handleChange('feelingWhileWaiting', v)} 
          />
          <TextAreaField 
            label="What physical sensations do I notice?" 
            value={formData.physicalSensationsBeforeExecution} 
            onChange={(v) => handleChange('physicalSensationsBeforeExecution', v)} 
          />
        </div>
        <div className="mt-6 md:w-1/2">
          <IntensitySlider 
            label="How intense is it?" 
            value={formData.intensityBeforeExecution} 
            onChange={(v) => handleChange('intensityBeforeExecution', v)} 
          />
        </div>
      </div>

      {/* SECTION D */}
      <div>
        <SectionHeader title="During the trade" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextAreaField 
            label="How am I feeling?" 
            value={formData.emotionDuringTrade} 
            onChange={(v) => handleChange('emotionDuringTrade', v)} 
          />
          <TextAreaField 
            label="What physical sensations do I notice?" 
            value={formData.physicalSensationsDuringTrade} 
            onChange={(v) => handleChange('physicalSensationsDuringTrade', v)} 
          />
          <TextAreaField 
            label="Am I experiencing hope?" 
            value={formData.experiencingHope} 
            onChange={(v) => handleChange('experiencingHope', v)} 
          />
          <TextAreaField 
            label="Do I regret being in this trade?" 
            value={formData.regretBeingInTrade} 
            onChange={(v) => handleChange('regretBeingInTrade', v)} 
          />
        </div>
        <div className="mt-6 md:w-1/2">
          <IntensitySlider 
            label="How intense is it?" 
            value={formData.intensityDuringTrade} 
            onChange={(v) => handleChange('intensityDuringTrade', v)} 
          />
        </div>
      </div>

      {/* SECTION E */}
      <div>
        <SectionHeader title="After closing the trade" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextAreaField 
            label="How am I feeling?" 
            value={formData.emotionAfterTrade} 
            onChange={(v) => handleChange('emotionAfterTrade', v)} 
          />
          <TextAreaField 
            label="Did I change my plan? Why?" 
            value={formData.changedPlan} 
            onChange={(v) => handleChange('changedPlan', v)} 
          />
          <TextAreaField 
            label="What physical sensations do I notice?" 
            value={formData.physicalSensationsAfterTrade} 
            onChange={(v) => handleChange('physicalSensationsAfterTrade', v)} 
          />
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <TextAreaField 
              label="What did I do well?" 
              value={formData.whatDidWell} 
              onChange={(v) => handleChange('whatDidWell', v)} 
            />
            <TextAreaField 
              label="What could I have done better?" 
              value={formData.whatCouldImprove} 
              onChange={(v) => handleChange('whatCouldImprove', v)} 
            />
          </div>
        </div>
        <div className="mt-6 md:w-1/2">
          <IntensitySlider 
            label="How intense is it?" 
            value={formData.intensityAfterTrade} 
            onChange={(v) => handleChange('intensityAfterTrade', v)} 
          />
        </div>
      </div>

      {/* LINKER & ACTIONS */}
      <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <TradeLinker 
          selectedTradeId={formData.linkedTradeId} 
          onChange={(v) => handleChange('linkedTradeId', v)} 
        />

        <div className="flex gap-3 w-full sm:w-auto">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 sm:flex-none justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="flex-1 sm:flex-none justify-center rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {initialData ? 'Save Changes' : 'Save Entry'}
          </button>
        </div>
      </div>
    </form>
  );
}
