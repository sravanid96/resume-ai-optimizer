import React, { useState } from 'react';
import { History, ChevronDown, Trash2 } from 'lucide-react';
import { OptimizationResponse } from '../../types';
import { formatDate } from '../../utils';

interface HistoryDropdownProps {
  history: OptimizationResponse[];
  currentData: OptimizationResponse;
  onSelect: (version: OptimizationResponse) => void;
  onClear: () => void;
}

export const HistoryDropdown: React.FC<HistoryDropdownProps> = ({
  history,
  currentData,
  onSelect,
  onClear
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (history.length === 0) return null;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md"
      >
        <History className="w-4 h-4 mr-1.5" />
        History
        <ChevronDown className="w-3 h-3 ml-1" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-50">
          {history.map((ver, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelect(ver);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 transition-colors flex justify-between items-center ${
                ver === currentData ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
              }`}
            >
              <span className="truncate mr-2">{formatDate(ver.timestamp)}</span>
              <span className={`text-xs font-bold ${
                ver.optimizedScore >= 80 ? 'text-green-600' : 'text-amber-500'
              }`}>
                {ver.optimizedScore}
              </span>
            </button>
          ))}
          <div className="border-t border-slate-100 mt-1 pt-1">
            <button 
              onClick={() => {
                onClear();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
            >
              <Trash2 className="w-3 h-3 mr-2" />
              Clear All History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

