import { create } from 'zustand';
import { PageAnalysisResponse } from '../types/analysisResponse';
import { PageIssuesClassification } from '../types/advancedReport';

export interface ISeoAnalyticsState {
  selectedCategory: string;
  freeAnalysisResponse: PageAnalysisResponse | null;
  advancedAnalysisResponse: PageIssuesClassification[] | null;
  urlToAnalyze: string;
  setSelectedCategory: (category: string) => void;
  setFreeAnalysisResponse: (response: PageAnalysisResponse | null) => void;
  setAdvancedAnalysisResponse: (response: PageIssuesClassification[] | null) => void;
  setUrlToAnalyze: (url: string) => void;
}

const initialSeoAnalyticsState: ISeoAnalyticsState = {
  selectedCategory: 'performance',
  freeAnalysisResponse: null,
  advancedAnalysisResponse: null,
  urlToAnalyze: '',
  setSelectedCategory: () => {},
  setFreeAnalysisResponse: () => {},
  setAdvancedAnalysisResponse: () => {},
  setUrlToAnalyze: () => {},
};

const useSeoAnalyticsStore = create<ISeoAnalyticsState>((set) => ({
  ...initialSeoAnalyticsState,
  setSelectedCategory: (category: string) => set({ selectedCategory: category }),
  setFreeAnalysisResponse: (response: PageAnalysisResponse | null) =>
    set({ freeAnalysisResponse: response }),
  setAdvancedAnalysisResponse: (response: PageIssuesClassification[] | null) =>
    set({ advancedAnalysisResponse: response }),
  setUrlToAnalyze: (url: string) => set({ urlToAnalyze: url }),
}));

export default useSeoAnalyticsStore;
