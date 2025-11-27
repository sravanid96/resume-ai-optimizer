import React from 'react';
import { Key } from 'lucide-react';

interface KeywordsPanelProps {
  keywords: string[];
  onKeywordClick: (keyword: string) => void;
}

export const KeywordsPanel: React.FC<KeywordsPanelProps> = ({ 
  keywords, 
  onKeywordClick 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex-shrink-0">
      <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center uppercase tracking-wide">
        <Key className="w-4 h-4 mr-2 text-amber-500" />
        Missing Keywords Found
      </h3>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <span 
            key={index} 
            onClick={() => onKeywordClick(keyword)}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 cursor-pointer hover:bg-amber-100 hover:scale-105 transition-all duration-200"
            title="Click to find in resume"
          >
            {keyword}
          </span>
        ))}
        {keywords.length === 0 && (
          <span className="text-sm text-slate-500 italic">No major keywords missing!</span>
        )}
      </div>
    </div>
  );
};

