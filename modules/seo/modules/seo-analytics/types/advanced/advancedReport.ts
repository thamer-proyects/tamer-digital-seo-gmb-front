import CrawlabilityData from './crawlability';
import InternalLinkingData from './internalLinking';
import MarkupData from './markup';

type AdvancedReportData = {
  crawlabilityData: CrawlabilityData;
  internalLinkingData: InternalLinkingData;
  markupData: MarkupData;
};

export default AdvancedReportData;
