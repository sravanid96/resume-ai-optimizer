import React from 'react';
import { ListChecks, CheckCircle2 } from 'lucide-react';

interface ImprovementsListProps {
  improvements: string[];
}

export const ImprovementsList: React.FC<ImprovementsListProps> = ({ improvements }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex-shrink-0">
      <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center uppercase tracking-wide">
        <ListChecks className="w-4 h-4 mr-2 text-green-500" />
        Key Improvements
      </h3>
      <ul className="space-y-3">
        {improvements.map((item, index) => (
          <li key={index} className="flex items-start text-sm text-slate-600 leading-relaxed">
            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500 shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

