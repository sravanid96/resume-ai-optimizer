import React from 'react';
import { ThumbsUp, RefreshCw } from 'lucide-react';

interface FeedbackSectionProps {
  isHelpful: boolean;
  onMarkHelpful: () => void;
  onRegenerate: () => void;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  isHelpful,
  onMarkHelpful,
  onRegenerate
}) => {
  return (
    <div className="mt-12 pt-8 border-t border-slate-100 pb-4">
      <div className="flex flex-col items-center justify-center text-center space-y-3">
        <h4 className="text-sm font-medium text-slate-500">
          Was this optimization helpful?
        </h4>
        
        {isHelpful ? (
          <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-full animate-fade-in">
            <ThumbsUp className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Thanks for your feedback!</span>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <button
              onClick={onMarkHelpful}
              className="flex items-center px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-full text-sm font-medium text-slate-600 hover:text-green-600 hover:border-green-200 hover:bg-green-50 transition-all"
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Yes
            </button>
            <button
              onClick={onRegenerate}
              className="flex items-center px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-full text-sm font-medium text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              No, Regenerate
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

