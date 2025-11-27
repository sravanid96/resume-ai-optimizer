import React from 'react';
import { BarChart2 } from 'lucide-react';

interface KeywordDensityChartProps {
  density: Array<[string, number]>;
}

export const KeywordDensityChart: React.FC<KeywordDensityChartProps> = ({ density }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex-shrink-0">
      <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center uppercase tracking-wide">
        <BarChart2 className="w-4 h-4 mr-2 text-indigo-500" />
        Keyword Density (Optimized)
      </h3>
      <div className="space-y-3">
        {density.map(([word, count], idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <span className="text-slate-600 truncate mr-2 flex-1">{word}</span>
            <div className="flex items-center">
              <div className="w-24 h-2 bg-slate-100 rounded-full mr-2 overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full" 
                  style={{ width: `${Math.min(100, count * 10)}%` }}
                />
              </div>
              <span className="text-slate-900 font-medium w-4 text-right">{count}</span>
            </div>
          </div>
        ))}
        {density.length === 0 && (
          <span className="text-sm text-slate-500 italic">Density data unavailable.</span>
        )}
      </div>
    </div>
  );
};

