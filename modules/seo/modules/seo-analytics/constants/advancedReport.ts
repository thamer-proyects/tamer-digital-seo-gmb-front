import {
  LayoutDashboard,
  Sliders,
  Link,
  Code2,
  Copy,
  ExternalLink,
  CheckSquare,
} from 'lucide-react';
import { AdvancedReportTabData } from '../types/advancedReportTabs';

export const tabsData: AdvancedReportTabData[] = [
  {
    key: 'overview',
    title: 'Overview',
    icon: LayoutDashboard,
    heading: 'General Overview',
    description: 'Site performance and SEO metrics overview will be displayed here.',
  },
  {
    key: 'crawlability',
    title: 'Crawlability',
    icon: Sliders,
    heading: 'On Page API Analysis',
    description: 'Crawlability metrics and analysis will be shown here.',
  },
  {
    key: 'internal-linking',
    title: 'Internal Linking',
    icon: Link,
    heading: 'Internal Link Structure',
    description: 'Internal linking analysis and recommendations will appear here.',
  },
  {
    key: 'markup',
    title: 'Markup',
    icon: Code2,
    heading: 'On-page API/Microdata',
    description: 'Structured data and markup analysis will be displayed here.',
  },
  {
    key: 'canonicalization',
    title: 'Canonicalization',
    icon: Copy,
    heading: 'Canonical Tags Analysis',
    description: 'Canonical URL implementation details will be shown here.',
  },
  {
    key: 'backlinks',
    title: 'Audit Backlinks',
    icon: ExternalLink,
    heading: 'Backlink Analysis',
    description: 'Comprehensive backlink audit details will be displayed here.',
  },
  {
    key: 'recommendations',
    title: 'Final Recommendations',
    icon: CheckSquare,
    heading: 'Final Recommendations',
    description:
      'Comprehensive analysis and actionable recommendations based on all previous sections will be presented here.',
  },
];
