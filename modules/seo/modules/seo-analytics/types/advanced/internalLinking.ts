type InternalLinkingData = {
  incomingLinks: IncomingLinkTier[];
  linkDistribution: LinkStrengthDistribution[];
  problematicPages: ProblematicPage[];
  navigationDepth: NavigationDepthData;
  detectedIssues: DetectedIssues;
};

type DetectedIssues = {
  criticalErrors: IssueDetail[];
  warnings: IssueDetail[];
  notices: IssueDetail[];
};

type IssueDetail = {
  url: string;
  severity: 'critical' | 'warning' | 'notice'; // Review I think that this enum have another values
  description: string;
};

type IncomingLinkTier = {
  tier: string;
  count: number;
};

type LinkStrengthDistribution = {
  strength: 'fuerte' | 'medio' | 'débil';
  percentage: number;
};

type ProblematicPage = {
  url: string;
  type: 'sin-enlaces' | 'enlaces-rotos';
  status?: number;
};

type NavigationDepthData = {
  depthDistribution: DepthDistribution[];
  criticalErrors: CriticalError[];
  deepestPages: DeepestPage[];
};

export type DepthDistribution = {
  depth: string;
  percentage: number;
};

export type CriticalError = {
  url: string;
  type: string;
  description: string;
};

export type DeepestPage = {
  url: string;
  clicks: number;
};

export default InternalLinkingData;
