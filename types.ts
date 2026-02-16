export interface ServiceProvider {
  id: string;
  name: string;
  trade: string;
  rating: number;
  reviewCount: number;
  hourlyRate: string;
  distance: string;
  badges: string[];
  description: string;
  availability: string;
  imageUrl?: string;
}

export interface SearchParams {
  query: string;
  zipCode: string;
}

export enum AppState {
  HOME = 'HOME',
  SEARCHING = 'SEARCHING',
  RESULTS = 'RESULTS',
  ANALYZING_PHOTO = 'ANALYZING_PHOTO'
}

export interface AiAnalysisResult {
  detectedTrade: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Emergency';
  estimatedCostRange: string;
}