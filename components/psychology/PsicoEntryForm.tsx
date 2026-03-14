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

function TextAreaField({ 
  label, 
  value, 
  onChange, 
  placeholder 
}: { 
  label: string, 
  value: string, 
  onChange: (val: string) => void,
  placeholder?: string
}) {
  const hasContent = value.trim().length > 0;
  
  return (
    <div className="flex flex-col gap-2 relative group">
      <label className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</label>
      <div className="relative">
        <textarea
          rows={1}
          placeholder={placeholder}
          className={`block w-full rounded-lg border ${hasContent ? 'border-primary-500/30 dark:border-primary-500/20 shadow-[0_0_15px_rgba(163,230,96,0.05)]' : 'border-gray-200/50 dark:border-white/5'} bg-white/50 dark:bg-black/20 px-4 py-3 text-sm placeholder-gray-400 transition-all duration-300 focus:border-primary-500/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500/20 dark:text-gray-100 dark:focus:bg-[#0c0d10]/90 resize-none overflow-hidden pr-10 hover:border-gray-300/80 dark:hover:border-white/10 shadow-inner`}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
          onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
            e.currentTarget.style.height = 'auto';
            e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
          }}
        />
        {hasContent && (
          <div className="absolute right-3 top-3 text-emerald-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

function IntensitySlider({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) {
  const getEmoji = (val: number) => {
    if (val <= 3) return '😌';
    if (val <= 6) return '😐';
    return '😰';
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm font-medium text-gray-600 dark:text-gray-300">
        <span>{label}</span>
        <span className="flex items-center gap-2">
          <span className="text-lg" role="img" aria-label="emoji">{getEmoji(value)}</span>
          <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs font-bold ring-1 ring-black/5 dark:ring-white/10 shadow-sm">
            {value} / 10
          </span>
        </span>
      </div>
      <div className="relative group">
        <div className="absolute top-1/2 left-0 w-full h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 opacity-70 group-hover:opacity-100 transition-opacity" />
        <input
          type="range"
          min={1}
          max={10}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative w-full h-2 appearance-none bg-transparent cursor-pointer 
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 
            [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 
            [&::-webkit-slider-thumb]:border-gray-900 [&::-webkit-slider-thumb]:shadow-md 
            dark:[&::-webkit-slider-thumb]:border-gray-800 dark:[&::-webkit-slider-thumb]:bg-gray-100
            focus:outline-none focus:ring-4 focus:ring-primary-500/30 rounded-full"
        />
      </div>
      <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}

export function PsicoEntryForm({ initialData, onSubmit, onCancel }: PsicoEntryFormProps) {
  const [formData, setFormData] = useState({ ...emptyForm, ...initialData });
  const [expandedSection, setExpandedSection] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof typeof emptyForm, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasContent = Object.entries(formData).some(([key, val]) => 
      typeof val === 'string' && val.trim() !== '' && key !== 'linkedTradeId'
    );
    
    if (!hasContent) {
      showToast("Please enter some journal contents before saving.");
      return;
    }

    setIsSubmitting(true);
    // Simulate slight delay for UX if feeling instant
    await new Promise(r => setTimeout(r, 400));
    onSubmit(formData);
    
    if (!initialData) {
      setFormData(emptyForm);
      setExpandedSection(0);
    }
    setIsSubmitting(false);
  };

  const sections = [
    {
      title: "Before opening the chart",
      icon: "👁",
      colorClass: "border-primary-500",
      bgClass: "bg-primary-50/40 dark:bg-primary-900/10",
      isFilled: formData.emotionBeforeChart.trim().length > 0
    },
    {
      title: "Before executing the trade",
      icon: "⚡",
      colorClass: "border-amber-400",
      bgClass: "bg-amber-50/40 dark:bg-amber-900/10",
      isFilled: [formData.emotionBeforeExecution, formData.scenarioWaitingFor, formData.feelingWhileWaiting, formData.physicalSensationsBeforeExecution].some(v => v.trim().length > 0)
    },
    {
      title: "During the trade",
      icon: "📊",
      colorClass: "border-emerald-500",
      bgClass: "bg-emerald-50/40 dark:bg-emerald-900/10",
      isFilled: [formData.emotionDuringTrade, formData.physicalSensationsDuringTrade, formData.experiencingHope, formData.regretBeingInTrade].some(v => v.trim().length > 0)
    },
    {
      title: "After closing the trade",
      icon: "✅",
      colorClass: "border-purple-500",
      bgClass: "bg-purple-50/40 dark:bg-purple-900/10",
      isFilled: [formData.emotionAfterTrade, formData.changedPlan, formData.physicalSensationsAfterTrade, formData.whatDidWell, formData.whatCouldImprove].some(v => v.trim().length > 0)
    }
  ];

  const totalFilled = sections.filter(s => s.isFilled).length;

  return (
    <div className="relative">
      {/* Toast Notification */}
      <div 
        className={`absolute -top-16 left-1/2 flex -translate-x-1/2 transform rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-800 shadow-md transition-all duration-300 dark:bg-red-900/80 dark:text-red-100 ${
          toastMessage ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        {toastMessage}
      </div>

      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl space-y-8">
        {/* Progress Bar */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            <span>Journal Progress</span>
            <span>{totalFilled} / 4 Sections</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div 
              className="h-full bg-primary-500 transition-all duration-500 ease-out dark:bg-primary-400"
              style={{ width: `${(totalFilled / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* SECTION 1: Before Chart */}
        <div className={`group overflow-hidden rounded-xl border border-gray-200/50 bg-white/60 dark:bg-[#121417]/80 dark:border-white/[0.05] backdrop-blur-xl shadow-lg transition-all duration-500 hover:shadow-xl dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-l-4 ${sections[0].colorClass}`}>
          <button 
            type="button" 
            onClick={() => setExpandedSection(expandedSection === 0 ? -1 : 0)}
            className={`flex w-full items-center justify-between p-6 md:p-8 ${sections[0].bgClass}`}
          >
            <div className="flex items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-sm dark:bg-gray-800 ring-1 ring-gray-100 dark:ring-gray-700">{sections[0].icon}</span>
              <div className="text-left">
                <span className="block text-xs font-semibold uppercase tracking-widest text-gray-400">Step 1</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{sections[0].title}</h3>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {sections[0].isFilled && <span className="text-emerald-500">✓</span>}
              <span className={`transform transition-transform text-gray-400 ${expandedSection === 0 ? 'rotate-180' : ''}`}>▼</span>
            </div>
          </button>
          
          <div className={`grid transition-all duration-300 ease-in-out ${expandedSection === 0 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <div className="p-6 md:p-8 pt-0 md:pt-0">
                <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-6">
                  <TextAreaField 
                    label="How am I feeling? (Emotions before opening the chart)" 
                    placeholder="e.g., Calm and focused, slightly anxious after yesterday's losses..."
                    value={formData.emotionBeforeChart} 
                    onChange={(v) => handleChange('emotionBeforeChart', v)} 
                  />
                  <div className="mt-6 flex justify-end">
                    <button type="button" onClick={() => setExpandedSection(1)} className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">Next Step →</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Before Execution */}
        <div className={`group overflow-hidden rounded-xl border border-gray-200/50 bg-white/60 dark:bg-[#121417]/80 dark:border-white/[0.05] backdrop-blur-xl shadow-lg transition-all duration-500 hover:shadow-xl dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-l-4 ${sections[1].colorClass}`}>
          <button 
            type="button" 
            onClick={() => setExpandedSection(expandedSection === 1 ? -1 : 1)}
            className={`flex w-full items-center justify-between p-6 md:p-8 ${sections[1].bgClass}`}
          >
            <div className="flex items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-sm dark:bg-gray-800 ring-1 ring-gray-100 dark:ring-gray-700">{sections[1].icon}</span>
              <div className="text-left">
                <span className="block text-xs font-semibold uppercase tracking-widest text-gray-400">Step 2</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{sections[1].title}</h3>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {sections[1].isFilled && <span className="text-emerald-500">✓</span>}
              <span className={`transform transition-transform text-gray-400 ${expandedSection === 1 ? 'rotate-180' : ''}`}>▼</span>
            </div>
          </button>
          
          <div className={`grid transition-all duration-300 ease-in-out ${expandedSection === 1 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <div className="p-6 md:p-8 pt-0 md:pt-0">
                <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-6 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextAreaField 
                      label="How am I feeling?" 
                      placeholder="e.g., Eager to enter, a bit impatient..."
                      value={formData.emotionBeforeExecution} 
                      onChange={(v) => handleChange('emotionBeforeExecution', v)} 
                    />
                    <TextAreaField 
                      label="What scenario am I waiting for?" 
                      placeholder="e.g., Pullback to VWAP with rejection tail..."
                      value={formData.scenarioWaitingFor} 
                      onChange={(v) => handleChange('scenarioWaitingFor', v)} 
                    />
                    <TextAreaField 
                      label="What do I feel while waiting? Why?" 
                      placeholder="e.g., Fear of missing out, price is moving fast..."
                      value={formData.feelingWhileWaiting} 
                      onChange={(v) => handleChange('feelingWhileWaiting', v)} 
                    />
                    <TextAreaField 
                      label="What physical sensations do I notice?" 
                      placeholder="e.g., Increased heart rate, tense shoulders..."
                      value={formData.physicalSensationsBeforeExecution} 
                      onChange={(v) => handleChange('physicalSensationsBeforeExecution', v)} 
                    />
                  </div>
                  <div className="md:w-1/2 p-6 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl border border-gray-100 dark:border-gray-800">
                    <IntensitySlider 
                      label="Emotional Intensity" 
                      value={formData.intensityBeforeExecution} 
                      onChange={(v) => handleChange('intensityBeforeExecution', v)} 
                    />
                  </div>
                  <div className="flex justify-between">
                    <button type="button" onClick={() => setExpandedSection(0)} className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">← Back</button>
                    <button type="button" onClick={() => setExpandedSection(2)} className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">Next Step →</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: During Trade */}
        <div className={`group overflow-hidden rounded-xl border border-gray-200/50 bg-white/60 dark:bg-[#121417]/80 dark:border-white/[0.05] backdrop-blur-xl shadow-lg transition-all duration-500 hover:shadow-xl dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-l-4 ${sections[2].colorClass}`}>
          <button 
            type="button" 
            onClick={() => setExpandedSection(expandedSection === 2 ? -1 : 2)}
            className={`flex w-full items-center justify-between p-6 md:p-8 ${sections[2].bgClass}`}
          >
            <div className="flex items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-sm dark:bg-gray-800 ring-1 ring-gray-100 dark:ring-gray-700">{sections[2].icon}</span>
              <div className="text-left">
                <span className="block text-xs font-semibold uppercase tracking-widest text-gray-400">Step 3</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{sections[2].title}</h3>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {sections[2].isFilled && <span className="text-emerald-500">✓</span>}
              <span className={`transform transition-transform text-gray-400 ${expandedSection === 2 ? 'rotate-180' : ''}`}>▼</span>
            </div>
          </button>
          
          <div className={`grid transition-all duration-300 ease-in-out ${expandedSection === 2 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <div className="p-6 md:p-8 pt-0 md:pt-0">
                <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-6 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextAreaField 
                      label="How am I feeling?" 
                      placeholder="e.g., Anxious as it nears my stop loss..."
                      value={formData.emotionDuringTrade} 
                      onChange={(v) => handleChange('emotionDuringTrade', v)} 
                    />
                    <TextAreaField 
                      label="What physical sensations do I notice?" 
                      placeholder="e.g., Holding my breath, staring at the 1m chart..."
                      value={formData.physicalSensationsDuringTrade} 
                      onChange={(v) => handleChange('physicalSensationsDuringTrade', v)} 
                    />
                    <TextAreaField 
                      label="Am I experiencing hope?" 
                      placeholder="e.g., Yes, hoping it turns around after breaking my level..."
                      value={formData.experiencingHope} 
                      onChange={(v) => handleChange('experiencingHope', v)} 
                    />
                    <TextAreaField 
                      label="Do I regret being in this trade?" 
                      placeholder="e.g., A little, volume is very low..."
                      value={formData.regretBeingInTrade} 
                      onChange={(v) => handleChange('regretBeingInTrade', v)} 
                    />
                  </div>
                  <div className="md:w-1/2 p-6 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl border border-gray-100 dark:border-gray-800">
                    <IntensitySlider 
                      label="Emotional Intensity" 
                      value={formData.intensityDuringTrade} 
                      onChange={(v) => handleChange('intensityDuringTrade', v)} 
                    />
                  </div>
                  <div className="flex justify-between">
                    <button type="button" onClick={() => setExpandedSection(1)} className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">← Back</button>
                    <button type="button" onClick={() => setExpandedSection(3)} className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">Next Step →</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: After Trade */}
        <div className={`group overflow-hidden rounded-xl border border-gray-200/50 bg-white/60 dark:bg-[#121417]/80 dark:border-white/[0.05] backdrop-blur-xl shadow-lg transition-all duration-500 hover:shadow-xl dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-l-4 ${sections[3].colorClass}`}>
          <button 
            type="button" 
            onClick={() => setExpandedSection(expandedSection === 3 ? -1 : 3)}
            className={`flex w-full items-center justify-between p-6 md:p-8 ${sections[3].bgClass}`}
          >
            <div className="flex items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-sm dark:bg-gray-800 ring-1 ring-gray-100 dark:ring-gray-700">{sections[3].icon}</span>
              <div className="text-left">
                <span className="block text-xs font-semibold uppercase tracking-widest text-gray-400">Step 4</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{sections[3].title}</h3>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {sections[3].isFilled && <span className="text-emerald-500">✓</span>}
              <span className={`transform transition-transform text-gray-400 ${expandedSection === 3 ? 'rotate-180' : ''}`}>▼</span>
            </div>
          </button>
          
          <div className={`grid transition-all duration-300 ease-in-out ${expandedSection === 3 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <div className="p-6 md:p-8 pt-0 md:pt-0">
                <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-6 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextAreaField 
                      label="How am I feeling?" 
                      placeholder="e.g., Relieved, frustrated, satisfied..."
                      value={formData.emotionAfterTrade} 
                      onChange={(v) => handleChange('emotionAfterTrade', v)} 
                    />
                    <TextAreaField 
                      label="Did I change my plan? Why?" 
                      placeholder="e.g., Moved stop to breakeven too early..."
                      value={formData.changedPlan} 
                      onChange={(v) => handleChange('changedPlan', v)} 
                    />
                    <TextAreaField 
                      label="What physical sensations do I notice?" 
                      placeholder="e.g., Adrenaline dropping, feeling tired..."
                      value={formData.physicalSensationsAfterTrade} 
                      onChange={(v) => handleChange('physicalSensationsAfterTrade', v)} 
                    />
                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-6 bg-emerald-50/30 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                      <TextAreaField 
                        label="What did I do well?" 
                        placeholder="e.g., Executed perfectly according to my edge..."
                        value={formData.whatDidWell} 
                        onChange={(v) => handleChange('whatDidWell', v)} 
                      />
                      <TextAreaField 
                        label="What could I have done better?" 
                        placeholder="e.g., Let my winners run a bit longer..."
                        value={formData.whatCouldImprove} 
                        onChange={(v) => handleChange('whatCouldImprove', v)} 
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2 p-6 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl border border-gray-100 dark:border-gray-800">
                    <IntensitySlider 
                      label="Emotional Intensity" 
                      value={formData.intensityAfterTrade} 
                      onChange={(v) => handleChange('intensityAfterTrade', v)} 
                    />
                  </div>
                  <div className="flex justify-between">
                    <button type="button" onClick={() => setExpandedSection(2)} className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">← Back</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LINKER & ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 mt-8 border-t border-gray-200 dark:border-gray-800">
          <TradeLinker 
            selectedTradeId={formData.linkedTradeId} 
            onChange={(v) => handleChange('linkedTradeId', v)} 
          />

          <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto justify-center rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full sm:w-auto items-center justify-center overflow-hidden rounded-lg bg-primary-600 px-8 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-primary-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-primary-400 dark:bg-primary-600 dark:hover:bg-primary-500 dark:focus:ring-offset-gray-900"
            >
              {isSubmitting ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <span>{initialData ? 'Save Changes' : 'Save Entry'}</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
