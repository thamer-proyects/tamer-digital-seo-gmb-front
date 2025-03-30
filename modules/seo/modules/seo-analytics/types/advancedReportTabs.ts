export interface SiteHealth {
  score: number;
  topSitesAverage: number;
}

export interface OverviewHeaderProps {
  siteHealth: SiteHealth;
}

export interface KeyIndicator {
  label: string;
  value: string | number;
  change?: number;
}

export interface TabSummary {
  key: string;
  title: string;
  icon: React.ElementType;
  indicators: KeyIndicator[];
  chartData: {
    labels: string[];
    data: number[];
  };
}

export interface AdvancedReportTabData {
  key: string;
  title: string;
  icon: React.ElementType;
  heading: string;
  description: string;
}
