// Types
export type SeoScoreData = {
  score: number;
  pagesAnalyzed: number;
  issuesFound: number;
};

export type Issue = {
  name: string;
  count: number;
};

export type IssueCardData = {
  title: string;
  issues: Issue[];
};

export type StatusItem = {
  name: string;
  status: 'valid' | 'enabled' | 'missing' | 'not_found';
};

export type StatusCardData = {
  title: string;
  items: StatusItem[];
};

export type SeoOnPageSummaryResponse = {
  seoScore: SeoScoreData;
  issueCards: IssueCardData[];
  statusCards: StatusCardData[];
};
