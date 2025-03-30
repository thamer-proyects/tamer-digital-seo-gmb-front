type AMPData = {
  implementation: AmpImplementationStatus;
  errorDistribution: AmpErrorDistribution;
  detectedIssues: AmpIssue[];
  nonCompliantPages: NonCompliantAMPPage[];
};

type NonCompliantAMPPage = {
  url: string;
  issues: AMPPageIssue[];
};

type AMPPageIssue = {
  category: AmpIssueCategory;
  description: string;
};

type AmpIssueCategory =
  | 'css-issues'
  | 'unoptimized-media'
  | 'invalid-forms'
  | 'disallowed-elements'
  | 'performance'
  | 'other';

type AmpImplementationStatus = {
  complianceLevels: number[];
  ampPages: {
    valid: number;
    invalid: number;
  };
};

type AmpErrorDistribution = {
  categories: AmpErrorCategory[];
  performanceThreshold: number;
};

type AmpErrorCategory = {
  type: 'validation' | 'market' | 'performance';
  percentage: number;
};

type AmpIssue = {
  url: string;
  type: AmpIssueType;
  details: string;
};

type AmpIssueType =
  | 'disallowed-elements'
  | 'css-restrictions'
  | 'performance'
  | 'missing-dimensions'
  | 'other';

export default AMPData;
