import React from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';

interface ScoreCardProps {
  originalScore: number;
  optimizedScore: number;
}

const ScoreRing: React.FC<{ score: number; label: string; color: string }> = ({ score, label, color }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        {/* Background Ring */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-100"
          />
          {/* Progress Ring */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${color} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className={`text-2xl font-bold ${color}`}>{score}</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-slate-600">{label}</span>
    </div>
  );
};

export const ScoreCard: React.FC<ScoreCardProps> = ({ originalScore, optimizedScore }) => {
  const improvement = optimizedScore - originalScore;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
        ATS Score Analysis
      </h3>
      
      <div className="flex flex-row flex-wrap items-center justify-around gap-8">
        <ScoreRing 
          score={originalScore} 
          label="Original Score" 
          color={originalScore < 50 ? 'text-red-500' : originalScore < 70 ? 'text-yellow-500' : 'text-green-500'} 
        />
        
        <div className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-lg mx-auto">
          <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Improvement</span>
          <span className="text-3xl font-bold text-indigo-700">+{improvement}%</span>
        </div>

        <ScoreRing 
          score={optimizedScore} 
          label="Optimized Score" 
          color="text-green-600" 
        />
      </div>
    </div>
  );
};