import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Info, X } from 'lucide-react';
import { InputSection } from './components/InputSection';
import { Button } from './components/Button';
import { ResultView } from './components/ResultView';
import { optimizeResumeWithGemini } from './services/geminiService';
import { AppState, OptimizationResponse } from './types';

export default function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<OptimizationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(true);
  const [history, setHistory] = useState<OptimizationResponse[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const savedJob = localStorage.getItem('jobDescription');
    const savedResume = localStorage.getItem('resumeText');
    const savedHistory = localStorage.getItem('resumeHistory');
    
    if (savedJob) setJobDescription(savedJob);
    if (savedResume) setResumeText(savedResume);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save inputs to local storage when changed
  useEffect(() => {
    localStorage.setItem('jobDescription', jobDescription);
  }, [jobDescription]);

  useEffect(() => {
    localStorage.setItem('resumeText', resumeText);
  }, [resumeText]);

  // Save history to local storage when changed
  useEffect(() => {
    localStorage.setItem('resumeHistory', JSON.stringify(history));
  }, [history]);

  const handleOptimize = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      setError("Please provide both the Job Description and your Resume content.");
      return;
    }

    setAppState(AppState.LOADING);
    setError(null);

    try {
      const response = await optimizeResumeWithGemini(jobDescription, resumeText);
      setResult(response);
      
      // Update history: add new result to front, keep max 5
      setHistory(prev => {
        const newHistory = [response, ...prev].slice(0, 5);
        return newHistory;
      });
      
      setAppState(AppState.SUCCESS);
    } catch (err) {
      console.error(err);
      setError("Failed to optimize resume. Please check your API key or try again later.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setResult(null);
    setError(null);
  };

  const handleSelectVersion = (version: OptimizationResponse) => {
    setResult(version);
    setAppState(AppState.SUCCESS);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('resumeHistory');
  };

  const handleUpdateResult = (updatedResumeText: string) => {
    if (result) {
      const updatedResult = { ...result, optimizedResume: updatedResumeText };
      setResult(updatedResult);
      // Update the current item in history if it matches the timestamp
      setHistory(prev => prev.map(item => 
        item.timestamp === result.timestamp ? updatedResult : item
      ));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">ResumeAI<span className="text-indigo-600">Optimizer</span></h1>
          </div>
          <div className="text-sm text-slate-500 font-medium hidden sm:block">
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {appState === AppState.IDLE || appState === AppState.LOADING || appState === AppState.ERROR ? (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-4">
                Beat the ATS. Get the Interview.
              </h2>
              <p className="text-lg text-slate-600">
                Paste your resume and the job description below. We'll identify missing keywords and rewrite your resume to match the job perfectly.
              </p>
            </div>

            {showTips && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start justify-between shadow-sm animate-fade-in">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-800 mb-1">Tips for Best Results</h4>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      For optimal analysis, paste <strong>plain text</strong> content. Ensure standard sections like <strong>Experience</strong>, <strong>Education</strong>, and <strong>Skills</strong> are clearly separated. Avoid pasting images, tables, or complex layout formatting.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowTips(false)} 
                  className="text-blue-400 hover:text-blue-600 transition-colors p-1 hover:bg-blue-100 rounded-full"
                  aria-label="Dismiss tips"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:h-[500px]">
              <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 h-auto md:h-full transition-all duration-300 ease-in-out focus-within:shadow-xl focus-within:shadow-indigo-100/50 focus-within:border-indigo-300">
                <InputSection
                  label="Job Description"
                  icon="job"
                  placeholder="Paste the full job description here..."
                  value={jobDescription}
                  onChange={setJobDescription}
                  minHeight="h-64 md:h-full"
                />
              </div>
              <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 h-auto md:h-full transition-all duration-300 ease-in-out focus-within:shadow-xl focus-within:shadow-indigo-100/50 focus-within:border-indigo-300">
                <InputSection
                  label="Your Resume"
                  icon="resume"
                  placeholder="Paste your current resume text here..."
                  value={resumeText}
                  onChange={setResumeText}
                  minHeight="h-64 md:h-full"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <div className="mr-3">
                  <span className="block text-xl font-bold">!</span>
                </div>
                <div>{error}</div>
              </div>
            )}

            <div className="flex justify-center pt-4 pb-12">
              <Button 
                onClick={handleOptimize} 
                isLoading={appState === AppState.LOADING}
                className="w-full md:w-auto min-w-[200px] text-lg shadow-lg shadow-indigo-200"
              >
                {appState === AppState.LOADING ? 'Optimizing...' : (
                  <>
                    Optimize My Resume <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          result && (
            <ResultView 
              data={result} 
              jobDescription={jobDescription}
              onReset={handleReset} 
              history={history}
              onSelectHistory={handleSelectVersion}
              onClearHistory={handleClearHistory}
              onUpdateResume={handleUpdateResult}
              onReOptimize={handleOptimize}
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} ResumeAI Optimizer. Built with React & Google Gemini.
        </div>
      </footer>
    </div>
  );
}