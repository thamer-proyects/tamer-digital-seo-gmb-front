type BacklinkAuditData = {
  summary: BacklinkSummary;
  followDistribution: FollowDistribution;
  geographicDistribution: GeographicDistribution;
  qualityMetrics: BacklinkQualityMetrics;
  referringDomains: ReferringDomainMetrics;
  toxicLinks: ToxicLinkMetrics;
  linkTypes: LinkTypeMetrics;
  trafficMetrics: TrafficMetrics;
  performanceMetrics: BacklinkPerformance;
  recentChanges: RecentChanges[];
};

type BacklinkSummary = {
  totalBacklinks: number[];
  metrics: {
    referringDomains: number;
    uniqueDomains: number;
  };
};

type FollowDistribution = {
  levels: number[];
  types: {
    doFollow: number;
    noFollow: number;
  };
};

type GeographicDistribution = {
  levels: number[];
  countries: CountryShare[];
};

type CountryShare = {
  country: string;
  percentage: number;
};

type BacklinkQualityMetrics = {
  qualityDistribution: QualityDistribution;
  qualityIndicators: QualityIndicator[];
};

type QualityDistribution = {
  categories: QualityCategory[];
  qualityLevels: number[];
};

type QualityCategory = {
  type: 'alta' | 'media' | 'baja';
  percentage: number;
};

type QualityIndicator = {
  name: 'alta-autoridad' | 'tóxicos' | 'referencia-temática';
  currentPercentage: number;
  trend: number;
};

type ReferringDomainMetrics = {
  topDomains: TopReferringDomain[];
  domainStats: DomainStatistics[];
};
type TopReferringDomain = {
  domain: string;
  authority: number;
  backlinks: number;
  relevance: RelevanceLevel;
};

type RelevanceLevel = 'ais' | 'mesa' | 'bip';

type DomainStatistics = {
  metric: 'unique-domains' | 'growth-rate' | 'quality-share';
  currentValue: number;
  changePercentage: number;
};

type ToxicLinkMetrics = {
  toxicityEvolution: ToxicityTimeline[];
  toxicityImpact: ToxicityImpact;
  detectedToxicLinks: ToxicLink[];
};

type ToxicityTimeline = {
  date: string;
  count: number;
};

type ToxicityImpact = {
  total: number;
  rankingImpact: number;
  trend: number;
};

type ToxicLink = {
  domain: string;
  url: string;
  toxicity: number;
  reason: ToxicLinkReason;
};

type ToxicLinkReason =
  | 'spam-content'
  | 'link-farm'
  | 'manipulative-linking'
  | 'pbn-detected'
  | 'other';

type LinkTypeMetrics = {
  typeDistribution: LinkTypeDistribution[];
  typeStatistics: LinkTypeStatistic[];
};

type LinkTypeDistribution = {
  type: 'text' | 'image' | 'redirect' | 'embedded-content';
  percentage: number;
};

type LinkTypeStatistic = {
  metric: 'text-vs-image' | 'multimedia' | 'redirects';
  currentValue: number;
  trend: number;
};

type TrafficMetrics = {
  trafficEvolution: TrafficTimeline[];
  trafficStats: TrafficStat[];
};

type TrafficTimeline = {
  date: string;
  visits: number;
};

type TrafficStat = {
  metric: 'total-traffic' | 'conversion-rate' | 'time-on-page';
  currentValue: number;
  trend: number;
};

type BacklinkPerformance = {
  topTrafficLinks: TopTrafficLink[];
  linkAcquisition: LinkAcquisitionMetrics;
};

type TopTrafficLink = {
  domain: string;
  monthlyTraffic: number;
  conversionRate: number;
};

type LinkAcquisitionMetrics = {
  newLinks: TrendMetric;
  lostLinks: TrendMetric;
  ratio: TrendMetric;
};

type TrendMetric = {
  value: number;
  trend: number;
};

type RecentChanges = {
  domain: string;
  changeType: 'smaid' | 'peddio' | 'other';
  date: string;
  authority: number;
};

export default BacklinkAuditData;
