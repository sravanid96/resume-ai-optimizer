export interface OptimizationResponse {
  originalScore: number;
  optimizedScore: number;
  missingKeywords: string[];
  optimizedResume: string;
  coverLetter: string;
  improvementsMade: string[];
  timestamp?: number;
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}