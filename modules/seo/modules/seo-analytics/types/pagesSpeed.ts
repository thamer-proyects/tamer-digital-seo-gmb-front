export type PageSpeedAudit = {
  id: string;
  title: string;
  description: string;
  score: number;
  displayValue?: string;
  details?: {
    items?: Array<{
      url?: string;
      wastedMs?: number;
      totalBytes?: number;
      wastedBytes?: number;
    }>;
  };
};

export type PageSpeedCategory = {
  id: string;
  title: string;
  description: string;
  score: number;
  auditRefs: Array<{
    id: string;
    weight: number;
    group?: string;
  }>;
};

export type PageSpeedResponse = {
  id: string;
  loadingExperience: {
    metrics: Record<string, any>;
    overall_category: string;
    initial_url: string;
  };
  originLoadingExperience: {
    metrics: Record<string, any>;
    overall_category: string;
    initial_url: string;
  };
  lighthouseResult: {
    requestedUrl: string;
    finalUrl: string;
    fetchTime: string;
    categories: Record<string, PageSpeedCategory>;
    audits: Record<string, PageSpeedAudit>;
  };
  analysisUTCTimestamp: string;
  kind: string;
};

export type CompleteAnalysis = {
  performance?: PageSpeedResponse;
  accessibility?: PageSpeedResponse;
  seo?: PageSpeedResponse;
  bestPractices?: PageSpeedResponse;
};
