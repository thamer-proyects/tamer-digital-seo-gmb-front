import ApiService from '@/service/api.service';
// import mockData from '@/modules/seo/modules/seo-analytics/mocks/create-website-report.json';
class SeoService extends ApiService {
  async analyzeWebsite(url: string) {
    try {
      const response = await this.axiosInstance.post('/seo/create-website-report', { url });
      return response.data;
      // return mockData;
    } catch (error) {
      console.error('Error analyzing website:', error);
      throw error;
    }
  }
}
const seoService = new SeoService();
export default seoService;
