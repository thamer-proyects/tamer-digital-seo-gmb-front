class Config {
  private static instance: Config | null = null;

  public readonly pagesSpeedInsightsApiKey: string | undefined;
  public readonly pagesSpeedInsightsApiUrl: string | undefined;
  public readonly apiUrl: string | undefined;
  public readonly dataForSeoLogin: string = '';
  public readonly dataForSeoPassword: string = '';
  public readonly dataForSeoMaxPages: number | undefined;
  public readonly dataForSeoPollInterval: number | undefined;
  public readonly dataForSeoMaxAttempts: number | undefined;

  private constructor() {
    this.pagesSpeedInsightsApiKey = process.env.NEXT_PUBLIC_PAGES_SPEED_INSIGHTS_API_KEY;
    this.pagesSpeedInsightsApiUrl = process.env.NEXT_PUBLIC_PAGES_SPEED_INSIGHTS_API_URL;
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL;
    this.dataForSeoLogin = process.env.NEXT_PUBLIC_DATAFORSEO_LOGIN ?? '';
    this.dataForSeoPassword = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD ?? '';
    this.dataForSeoMaxPages = process.env.NEXT_PUBLIC_DATAFORSEO_MAX_PAGES
      ? parseInt(process.env.NEXT_PUBLIC_DATAFORSEO_MAX_PAGES, 10)
      : undefined;
    this.dataForSeoPollInterval = process.env.NEXT_PUBLIC_DATAFORSEO_POLL_INTERVAL
      ? parseInt(process.env.NEXT_PUBLIC_DATAFORSEO_POLL_INTERVAL, 10)
      : undefined;
    this.dataForSeoMaxAttempts = process.env.NEXT_PUBLIC_DATAFORSEO_MAX_ATTEMPTS
      ? parseInt(process.env.NEXT_PUBLIC_DATAFORSEO_MAX_ATTEMPTS, 10)
      : undefined;
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
}

const config = Config.getInstance();
export default config;
