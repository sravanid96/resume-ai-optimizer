import React, { useState, useMemo, useRef, useEffect } from 'react';
import { OptimizationResponse } from '../types';
import { ScoreCard } from './ScoreCard';
import { 
  KeywordsPanel, 
  KeywordDensityChart, 
  ImprovementsList,
  DocumentToolbar,
  MarkdownPreview,
  FeedbackSection,
  TabType
} from './result';
import { 
  cleanMarkdownText, 
  highlightKeywords, 
  calculateKeywordDensity,
  copyToClipboard,
  keywordToSlug
} from '../utils';

interface ResultViewProps {
  data: OptimizationResponse;
  jobDescription: string;
  onReset: () => void;
  history: OptimizationResponse[];
  onSelectHistory: (version: OptimizationResponse) => void;
  onClearHistory: () => void;
  onUpdateResume: (text: string) => void;
  onReOptimize: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ 
  data, 
  jobDescription, 
  onReset, 
  history, 
  onSelectHistory, 
  onClearHistory,
  onUpdateResume,
  onReOptimize
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('resume');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'helpful'>('idle');
  
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const coverLetterPreviewRef = useRef<HTMLDivElement>(null);

  const [editedResume, setEditedResume] = useState(cleanMarkdownText(data.optimizedResume));
  const [editedCoverLetter, setEditedCoverLetter] = useState(cleanMarkdownText(data.coverLetter || ""));

  // Sync edited text when data changes (e.g. selecting history)
  useEffect(() => {
    setEditedResume(cleanMarkdownText(data.optimizedResume));
    setEditedCoverLetter(cleanMarkdownText(data.coverLetter || ""));
    setFeedbackStatus('idle');
  }, [data.optimizedResume, data.coverLetter]);

  // Computed values
  const highlightedResume = useMemo(() => 
    highlightKeywords(data.optimizedResume, data.missingKeywords),
    [data.optimizedResume, data.missingKeywords]
  );

  const keywordDensity = useMemo(() => 
    calculateKeywordDensity(data.optimizedResume, data.missingKeywords),
    [data.optimizedResume, data.missingKeywords]
  );

  // Handlers
  const handleCopy = async (forWord: boolean = false) => {
    const currentText = activeTab === 'resume' ? editedResume : editedCoverLetter;
    const currentRef = activeTab === 'resume' ? resumePreviewRef : coverLetterPreviewRef;

    if (isEditing) {
      await navigator.clipboard.writeText(currentText);
    } else {
      await copyToClipboard(currentRef.current, currentText, forWord);
    }
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (activeTab === 'resume') {
      onUpdateResume(editedResume);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedResume(cleanMarkdownText(data.optimizedResume));
    setEditedCoverLetter(cleanMarkdownText(data.coverLetter || ""));
    setIsEditing(false);
  };

  const handleKeywordClick = (keyword: string) => {
    if (activeTab !== 'resume') {
      setActiveTab('resume');
      setTimeout(() => scrollToKeyword(keyword), 100);
    } else {
      scrollToKeyword(keyword);
    }
  };

  const scrollToKeyword = (keyword: string) => {
    const slug = keywordToSlug(keyword);
    const element = document.getElementById(`keyword-${slug}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('bg-yellow-200');
      setTimeout(() => element.classList.remove('bg-yellow-200'), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      <ScoreCard 
        originalScore={data.originalScore} 
        optimizedScore={data.optimizedScore} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[700px] h-auto">
        {/* Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6 lg:h-full h-auto overflow-y-auto pr-1 custom-scrollbar">
          <KeywordsPanel 
            keywords={data.missingKeywords} 
            onKeywordClick={handleKeywordClick} 
          />
          
          <KeywordDensityChart density={keywordDensity} />
          
          <ImprovementsList improvements={data.improvementsMade} />
          
          <button 
            onClick={onReset}
            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors text-sm mt-auto hidden lg:block"
          >
            Optimize Another Resume
          </button>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col lg:h-full h-[500px] sm:h-[600px]">
          <DocumentToolbar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isEditing={isEditing}
            copied={copied}
            history={history}
            currentData={data}
            onReset={onReset}
            onEdit={() => setIsEditing(true)}
            onSave={handleSave}
            onCancelEdit={handleCancelEdit}
            onCopy={() => handleCopy(false)}
            onCopyToWord={() => handleCopy(true)}
            onSelectHistory={onSelectHistory}
            onClearHistory={onClearHistory}
          />

          <div className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar relative">
            {isEditing ? (
              <textarea 
                className="w-full h-full resize-none outline-none text-slate-800 font-mono text-sm leading-relaxed p-4 bg-white"
                value={activeTab === 'resume' ? editedResume : editedCoverLetter}
                onChange={(e) => activeTab === 'resume' 
                  ? setEditedResume(e.target.value) 
                  : setEditedCoverLetter(e.target.value)
                }
                spellCheck={false}
              />
            ) : (
              <>
                {activeTab === 'resume' ? (
                  <MarkdownPreview
                    ref={resumePreviewRef}
                    content={highlightedResume}
                    jobDescription={jobDescription}
                    highlightKeywords={true}
                  />
                ) : (
                  <MarkdownPreview
                    ref={coverLetterPreviewRef}
                    content={editedCoverLetter}
                  />
                )}
                
                <FeedbackSection
                  isHelpful={feedbackStatus === 'helpful'}
                  onMarkHelpful={() => setFeedbackStatus('helpful')}
                  onRegenerate={onReOptimize}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
