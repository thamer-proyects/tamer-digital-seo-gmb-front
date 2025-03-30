import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingContext } from '@/store/loadingContext';
import { AnalysisFormData } from '../schema/analysisSchema';
import useSeoAnalyticsStore from '../store/seoAnalyticsStore';
import { fetchSpeedResults } from '../services/pageSpeed.service';
import { transformSpeedResults } from '../utils/transformSpeedResults';
import { PageAnalysisResponse } from '../types/analysisResponse';
import { createSeoTask, instantPages, pollSeoTaskStatus } from '../services/dataforSeo.service';
import { mapPagesItemToIssues } from '../adapters/advancedReport';

export function useAnalysis() {
  const router = useRouter();
  const { setLoading, setMessage, setPercentage } = useContext(LoadingContext);
  const { setFreeAnalysisResponse, setAdvancedAnalysisResponse, setUrlToAnalyze } =
    useSeoAnalyticsStore();

  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [pagesChecked, setPagesChecked] = useState(0);
  const [totalPages, setTotalPages] = useState(10);

  const createBasicAnalysis = async (data: AnalysisFormData) => {
    setError(null);
    setLoading(true);
    setMessage('Creating website report...');

    try {
      const [mobileData, desktopData, seoTaskId] = await Promise.all([
        fetchSpeedResults(data.url, 'mobile'),
        fetchSpeedResults(data.url, 'desktop'),
        createSeoTask(data.url),
      ]);

      const seoResult = await pollSeoTaskStatus(
        seoTaskId,
        totalPages,
        setProgress,
        setPagesChecked,
        setPercentage,
      );

      const transformedMobileData = transformSpeedResults(mobileData);
      const transformedDesktopData = transformSpeedResults(desktopData);

      const analysisResult: PageAnalysisResponse = {
        url: data.url,
        speed: {
          mobile: transformedMobileData,
          desktop: transformedDesktopData,
        },
        seo: seoResult,
      };

      setFreeAnalysisResponse(analysisResult);
      setUrlToAnalyze(data.url);

      router.push('/seo/analysis/free');
    } catch (err: any) {
      setError(err.message || 'Ha ocurrido un error inesperado');
    } finally {
      setLoading(false);
      setPercentage(0);
      setPagesChecked(0);
    }
  };

  const createAdvancedAnalysis = async (url: string) => {
    setError(null);
    setLoading(true);
    setMessage('Creating advanced website report...');

    try {
      const pagesResult = await instantPages(url);
      if (!pagesResult) return;

      const parsedResults = pagesResult.items.map(mapPagesItemToIssues);

      setAdvancedAnalysisResponse(parsedResults);
      router.push('/seo/analysis/advanced');
    } catch (err: any) {
      console.log({ err });
      setError(err.message || 'Ha ocurrido un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    progress,
    pagesChecked,
    totalPages,
    setTotalPages,
    createBasicAnalysis,
    createAdvancedAnalysis,
  };
}
