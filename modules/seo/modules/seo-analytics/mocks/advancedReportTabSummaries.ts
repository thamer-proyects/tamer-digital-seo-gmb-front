import { TabSummary } from '@/modules/seo/modules/seo-analytics/types/advancedReportTabs';
import { Sliders, Link, Code2, Copy, Globe2, Zap, ExternalLink, CheckSquare } from 'lucide-react';

export const tabSummariesData: TabSummary[] = [
  {
    key: 'crawlability',
    title: 'Crawlability',
    icon: Sliders,
    indicators: [
      { label: 'Pages Crawled', value: 1243, change: 5.2 },
      { label: 'Crawl Errors', value: 23, change: -12.4 },
      { label: 'Crawl Time', value: '2.3s', change: -8.1 },
    ],
    chartData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [65, 72, 68, 74, 80, 78, 82],
    },
  },
  {
    key: 'internal-linking',
    title: 'Internal Linking',
    icon: Link,
    indicators: [
      { label: 'Total Links', value: 3456, change: 2.8 },
      { label: 'Broken Links', value: 12, change: -45.2 },
      { label: 'Avg. Depth', value: '3.2', change: -5.6 },
    ],
    chartData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [45, 52, 48, 54, 58, 62, 60],
    },
  },
  {
    key: 'markup',
    title: 'Markup',
    icon: Code2,
    indicators: [
      { label: 'Valid Tags', value: '98%', change: 1.2 },
      { label: 'Errors', value: 15, change: -33.3 },
      { label: 'Warnings', value: 42, change: -12.5 },
    ],
    chartData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [88, 85, 90, 92, 89, 94, 96],
    },
  },
  {
    key: 'http_status_codes',
    title: 'HTTP Status Codes',
    icon: Copy,
    indicators: [
      { label: 'Canonical URLs', value: 856, change: 3.4 },
      { label: 'Duplicates', value: 8, change: -62.1 },
      { label: 'Coverage', value: '94%', change: 2.8 },
    ],
    chartData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [75, 78, 82, 80, 85, 88, 92],
    },
  },
  {
    key: 'canonicalization',
    title: 'Canonicalization',
    icon: Copy,
    indicators: [
      { label: 'Canonical URLs', value: 856, change: 3.4 },
      { label: 'Duplicates', value: 8, change: -62.1 },
      { label: 'Coverage', value: '94%', change: 2.8 },
    ],
    chartData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [75, 78, 82, 80, 85, 88, 92],
    },
  },
  {
    key: 'hreflang',
    title: 'Hreflang',
    icon: Globe2,
    indicators: [
      { label: 'Languages', value: 12, change: 20.0 },
      { label: 'Errors', value: 3, change: -57.1 },
      { label: 'Coverage', value: '96%', change: 4.2 },
    ],
    chartData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [82, 85, 88, 86, 90, 92, 94],
    },
  },
  {
    key: 'amp',
    title: 'AMP Links',
    icon: Zap,
    indicators: [
      { label: 'AMP Pages', value: 234, change: 15.2 },
      { label: 'Valid AMP', value: '98%', change: 2.1 },
      { label: 'Avg. Speed', value: '0.8s', change: -25.0 },
    ],
    chartData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [55, 62, 58, 65, 70, 68, 72],
    },
  },
  {
    key: 'backlinks',
    title: 'Backlinks',
    icon: ExternalLink,
    indicators: [
      { label: 'Total Links', value: 12543, change: 8.4 },
      { label: 'Domain Rating', value: 68, change: 4.6 },
      { label: 'Spam Score', value: '2%', change: -65.2 },
    ],
    chartData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [68, 72, 70, 75, 78, 82, 85],
    },
  },
  {
    key: 'recommendations',
    title: 'Recommendations',
    icon: CheckSquare,
    indicators: [
      { label: 'Total Issues', value: 86, change: -12.3 },
      { label: 'Critical', value: 5, change: -44.4 },
      { label: 'Completed', value: '72%', change: 15.2 },
    ],
    chartData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [60, 65, 68, 72, 75, 78, 82],
    },
  },
];
