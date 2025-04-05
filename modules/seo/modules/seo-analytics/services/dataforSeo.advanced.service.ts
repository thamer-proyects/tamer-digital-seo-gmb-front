import axios from 'axios';
import AdvancedReportData from '../types/advanced/advancedReport';
import config from '@/config/config';

export const getAdvancedSeoReport = async (targetUrl: string): Promise<AdvancedReportData> => {
  try {
    console.log('Requesting report for:', targetUrl);
    const response = await axios.post(
      config.apiUrl ??
      'http://localhost:8000/seo/advanced-report',
      { targetUrl },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('Response received:', response.data);
    return response.data as AdvancedReportData;
  } catch (err) {
    console.error('Error fetching advanced SEO report:', err);
    throw new Error('Failed to retrieve advanced SEO analysis');
  }
};
