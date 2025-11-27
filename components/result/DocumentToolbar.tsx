import React from 'react';
import { 
  FileText, Mail, RotateCcw, Edit3, Save, 
  FileDown, Copy, CheckCircle2 
} from 'lucide-react';
import { OptimizationResponse } from '../../types';
import { HistoryDropdown } from './HistoryDropdown';

export type TabType = 'resume' | 'coverLetter';

interface DocumentToolbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isEditing: boolean;
  copied: boolean;
  history: OptimizationResponse[];
  currentData: OptimizationResponse;
  onReset: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancelEdit: () => void;
  onCopy: () => void;
  onCopyToWord: () => void;
  onSelectHistory: (version: OptimizationResponse) => void;
  onClearHistory: () => void;
}

export const DocumentToolbar: React.FC<DocumentToolbarProps> = ({
  activeTab,
  onTabChange,
  isEditing,
  copied,
  history,
  currentData,
  onReset,
  onEdit,
  onSave,
  onCancelEdit,
  onCopy,
  onCopyToWord,
  onSelectHistory,
  onClearHistory
}) => {
  const tabButtonClass = (tab: TabType) => 
    `flex items-center text-sm font-semibold transition-colors pb-1 border-b-2 ${
      activeTab === tab 
        ? 'text-indigo-600 border-indigo-600' 
        : 'text-slate-500 border-transparent hover:text-slate-700'
    }`;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex-shrink-0 gap-3 sm:gap-0 z-10 relative">
      {/* Tabs */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => onTabChange('resume')}
          className={tabButtonClass('resume')}
        >
          <FileText className="w-4 h-4 mr-2" />
          Optimized Resume
        </button>
        <button 
          onClick={() => onTabChange('coverLetter')}
          className={tabButtonClass('coverLetter')}
        >
          <Mail className="w-4 h-4 mr-2" />
          Cover Letter
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end mt-3 sm:mt-0">
        {!isEditing && (
          <button
            onClick={onReset}
            className="flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md"
            title="Optimize Another Resume"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            New
          </button>
        )}

        {!isEditing && (
          <HistoryDropdown
            history={history}
            currentData={currentData}
            onSelect={onSelectHistory}
            onClear={onClearHistory}
          />
        )}

        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={onCancelEdit}
                className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors px-3 py-1.5"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="flex items-center text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-1.5 rounded-md shadow-sm"
              >
                <Save className="w-4 h-4 mr-1.5" />
                Save
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-md"
              >
                <Edit3 className="w-4 h-4 mr-1.5" />
                Edit
              </button>
              
              <button
                onClick={onCopyToWord}
                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 border border-blue-100"
                title="Copy formatted for Word"
              >
                <FileDown className="w-4 h-4 mr-1.5" />
                Word
              </button>

              <button
                onClick={onCopy}
                className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-700 transition-colors bg-slate-50 px-3 py-1.5 rounded-md hover:bg-slate-100 border border-slate-200"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1.5" />
                    Copy
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

