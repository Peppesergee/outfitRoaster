export type RoastTone = 'brutal' | 'ironic' | 'constructive';
export type RoastLanguage = 'en' | 'it';

export interface RoastResult {
  id: string;
  roast: string;
  score: number;
  styleLabel: string;
  tip: string;
  dominantColors: string[];
  emoji: string;
  imageUri: string;
  tone: RoastTone;
  intensity: number;
  language: RoastLanguage;
  createdAt: string;
}

export interface OnboardingData {
  tone: RoastTone;
  username?: string;
  completed: boolean;
}

export interface RoastApiResponse {
  success: boolean;
  data?: {
    roast: string;
    score: number;
    styleLabel: string;
    tip: string;
    dominantColors: string[];
    emoji: string;
  };
  error?: string;
}
