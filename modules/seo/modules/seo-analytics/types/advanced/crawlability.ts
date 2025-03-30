type CrawlabilityData = {
  clickDepth: {
    distribution: ClickDepthDistribution[];
    deepestPages: DeepestPage[];
  };
  httpStatus: {
    distribution: HttpStatusDistribution[];
    errorPages: ErrorPage[];
  };
  crawlBudget: {
    wastedBudget: WastedBudgetItem[];
    crawlProgress: CrawlProgress;
  };
};

type ClickDepthDistribution = {
  depth: string; // Ej: "1 clic", "4+ clics"
  percentage: number;
};

type DeepestPage = {
  url: string;
  clicks: number;
};

type HttpStatusDistribution = {
  code: string; // Ej: "2xx", "4xx"
  percentage: number;
};

type ErrorPage = {
  url: string;
  status: number; // Ej: 404, 500
  message: string; // Ej: "Not Found"
};

type WastedBudgetItem = {
  name: string;
  percentage: number;
  levels?: {
    // Niveles de la tabla (25%, 50%, 75%, 100%)
    level25: boolean;
    level50: boolean;
    level75: boolean;
    level100: boolean;
  };
};

type CrawlProgress = {
  progress: number; // 85%
  crawled: number; // 85%
  blocked: number; // 15%
  lastCrawlDate?: string; // Fecha opcional desde BE
};

export default CrawlabilityData;
