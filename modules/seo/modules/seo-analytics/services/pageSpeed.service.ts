import axios from 'axios';
import config from '@/config/config';

/**
 * Llama a la API de PageSpeed Insights para cada categoría y estrategia (mobile, desktop).
 * @param inputUrl URL a analizar
 * @param strategy mobile o desktop
 * @returns Arreglo de resultados de PageSpeed para cada categoría
 */
export const fetchSpeedResults = async (inputUrl: string, strategy: 'mobile' | 'desktop') => {
  const categories = ['performance', 'accessibility', 'best-practices', 'seo'];

  try {
    const responses = await Promise.all(
      categories.map((category) =>
        axios.get(
          config.pagesSpeedInsightsApiUrl ??
            'https://www.googleapis.com/pagespeedonline/v5/runPagespeed',
          {
            params: {
              url: inputUrl,
              key: config.pagesSpeedInsightsApiKey,
              strategy,
              category,
            },
          },
        ),
      ),
    );

    return responses.map((response) => {
      const { lighthouseResult, loadingExperience } = response.data;
      const { categories, audits } = lighthouseResult;

      return {
        categories,
        audits,
        loadingExperience,
      };
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error?.message || 'Failed to analyze website. Please try again.',
      );
    }
    throw error;
  }
};
