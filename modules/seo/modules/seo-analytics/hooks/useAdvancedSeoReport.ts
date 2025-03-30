import { useState, useEffect } from 'react';
import { getAdvancedSeoReport } from '../services/dataforSeo.advanced.service';
import type AdvancedReportData from '../types/advanced/advancedReport';

export function useAdvancedSeoReport(targetUrl: string = 'example.com') {
  const [data, setData] = useState<AdvancedReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getAdvancedSeoReport(targetUrl);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [targetUrl]);

  return { data, isLoading, error };
}
