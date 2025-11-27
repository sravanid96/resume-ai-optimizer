import React from 'react';
import { FileText, Briefcase } from 'lucide-react';

interface InputSectionProps {
  label: string;
  icon: 'job' | 'resume';
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  minHeight?: string;
}

export const InputSection: React.FC<InputSectionProps> = ({
  label,
  icon,
  placeholder,
  value,
  onChange,
  minHeight = "h-64"
}) => {
  return (
    <div className="flex flex-col h-full">
      <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
        {icon === 'job' ? <Briefcase className="w-4 h-4 mr-2 text-indigo-500" /> : <FileText className="w-4 h-4 mr-2 text-indigo-500" />}
        {label}
      </label>
      <div className="relative flex-grow group">
        <textarea
          className={`w-full ${minHeight} p-4 rounded-lg border border-slate-200 bg-white text-slate-800 placeholder-slate-400 
            focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:shadow-[0_4px_20px_rgba(99,102,241,0.1)] 
            resize-none transition-all duration-200 ease-in-out shadow-sm hover:shadow-md hover:border-indigo-200
            text-sm leading-relaxed`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};