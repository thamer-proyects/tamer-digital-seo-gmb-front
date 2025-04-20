
import type { PageAnalysisResponse, Metric, Issue } from "../types/analysisResponse";

interface AIAnalysisResponse {
  data: {
    success: boolean;
    data: {
      content: string;
      type: string;
      wordCount: number;
      withinLimit: boolean;
    };
  };
}

interface AIAnalysisSection {
  analysis: string;
  recommendations: string[];
  conclusions?: string; // Nueva propiedad para conclusiones generales
}

interface AIAnalysisResult {
  sections: Record<string, AIAnalysisSection>;
  recommendations: Record<string, string[]>;
  fullAnalysis: string;
  seoAnalysis: AIAnalysisSection;
  onPageAnalysis: AIAnalysisSection;
}

function normalizeCategory(category: string): string {
  return category.replace(/\s+/g, "_").toUpperCase();
}

// Función específica para generar el prompt para SEO
function generateSEOPrompt(pageAnalysis: PageAnalysisResponse): string {
  if (!pageAnalysis.seo || !pageAnalysis.seo.page_metrics) {
    return "";
  }

  const seoData = pageAnalysis.seo;
  const pageMetrics = seoData.page_metrics;

  const metricsInfo = [
    `External Links: ${pageMetrics.links_external}`,
    `Internal Links: ${pageMetrics.links_internal}`,
    `Duplicate Titles: ${pageMetrics.duplicate_title}`,
    `Duplicate Descriptions: ${pageMetrics.duplicate_description}`,
    `Broken Links: ${pageMetrics.broken_links}`,
    `Non-indexable Pages: ${pageMetrics.non_indexable}`,
  ].join(". ");

  return `Analyze the following SEO metrics and provide:
1. ANALYSIS (max 300 words):
- Key findings and interpretation of metrics
- Strengths and weaknesses
- Significant patterns in technical SEO

2. RECOMMENDATIONS (3-5 specific actions):
- Prioritized list of actionable improvements for technical SEO
- Focus on critical issues
- Consider both technical and business impact

3. GENERAL CONCLUSIONS (max 100 words):
- Overall assessment of SEO health
- Summary of critical priorities
- Expected impact of implementing recommendations

Analysis data:
- Technical SEO metrics: ${metricsInfo}

Format your response in English as:
"Analysis: [your analysis text]
Recommendations:
1. [First recommendation]
2. [Second recommendation]
...
Conclusions: [your conclusions text]"`;
}

// Función específica para generar el prompt para On-Page Score
function generateOnPagePrompt(pageAnalysis: PageAnalysisResponse): string {
  if (!pageAnalysis.seo || !pageAnalysis.seo.page_metrics) {
    return "";
  }

  const seoData = pageAnalysis.seo;
  const pageMetrics = seoData.page_metrics;
  const domainInfo = seoData.domain_info;

  const onPageInfo = [`On-page Score: ${Math.round(pageMetrics.onpage_score )}%`].join(". ");

  const checksInfo = [
    `CMS: ${domainInfo.cms || "Not detected"}`,
    `Server: ${domainInfo.server || "Unknown"}`,
    `Total Pages: ${domainInfo.total_pages}`,
    `Valid SSL Certificate: ${domainInfo.ssl_info.valid_certificate ? "Yes" : "No"}`,
    `Sitemap: ${domainInfo.checks.sitemap ? "Yes" : "No"}`,
    `robots.txt: ${domainInfo.checks.robots_txt ? "Yes" : "No"}`,
    `HTTPS Redirect: ${domainInfo.checks.test_https_redirect ? "Yes" : "No"}`,
    `Canonicalization: ${domainInfo.checks.test_canonicalization ? "Yes" : "No"}`,
    `HTTP/2: ${domainInfo.checks.http2 ? "Yes" : "No"}`,
  ].join(". ");

  return `Analyze the following On-Page score data and provide:
1. ANALYSIS (max 300 words):
- Key findings and interpretation of On-Page score
- Strengths and weaknesses in on-page optimization
- Significant patterns

2. RECOMMENDATIONS (3-5 specific actions):
- Prioritized list of actionable improvements for on-page optimization
- Focus on critical issues
- Consider both technical and business impact

3. GENERAL CONCLUSIONS (max 100 words):
- Overall assessment of on-page optimization
- Summary of critical priorities
- Expected impact of implementing recommendations

Analysis data:
- On-Page Score: ${onPageInfo}
- Domain and checks information: ${checksInfo}

Format your response in English as:
"Analysis: [your analysis text]
Recommendations:
1. [First recommendation]
2. [Second recommendation]
...
Conclusions: [your conclusions text]"`;
}

// Función para generar prompts para categorías de velocidad
function generateSpeedPrompt(
  pageAnalysis: PageAnalysisResponse,
  category: string,
  deviceType: "mobile" | "desktop",
): string {
  const normalizedSearchCategory = category.toLowerCase().replace(/\s+/g, "-");

  if (normalizedSearchCategory === "best-practices") {
    const data = pageAnalysis.speed[deviceType].find(
      (cat) => cat.category === "best-practices" || cat.category === "best practices",
    );

    if (!data) {
      return "";
    }

    const metricsInfo = data.metrics
      .map((metric: Metric) => `${metric.name}: ${metric.value} (Score: ${metric.score}%)`)
      .join(". ");

    const issuesInfo = data.issues
      .map((issue: Issue) => `${issue.title}: ${issue.description || "No description"}`)
      .join(". ");

    return `Analyze the following performance data for ${deviceType.toUpperCase()} BEST_PRACTICES and provide:
1. ANALYSIS (max 300 words):
- Key findings and interpretation of metrics
- Strengths and weaknesses
- Significant patterns

2. RECOMMENDATIONS (3-5 specific actions):
- Prioritized list of actionable improvements
- Focus on critical issues
- Consider both technical and business impact

3. GENERAL CONCLUSIONS (max 200 words):
- Overall assessment of best practices
- Summary of critical priorities
- Expected impact of implementing recommendations

Analysis data:
- Score: ${data.score}%
- Metrics: ${metricsInfo}
- Identified issues: ${issuesInfo}

Format your response in English as:
"Analysis: [your analysis text]
Recommendations:
1. [First recommendation]
2. [Second recommendation]
...
Conclusions: [your conclusions text]"`;
  }

  const data = pageAnalysis.speed[deviceType].find((cat) => cat.category === normalizedSearchCategory);

  if (!data) {
    return "";
  }

  const metricsInfo = data.metrics
    .map((metric: Metric) => `${metric.name}: ${metric.value} (Score: ${metric.score}%)`)
    .join(". ");

  const issuesInfo = data.issues
    .map((issue: Issue) => `${issue.title}: ${issue.description || "No description"}`)
    .join(". ");

  return `Analyze the following performance data for ${deviceType.toUpperCase()} ${normalizeCategory(category)} and provide:
1. ANALYSIS (max 300 words):
- Key findings and interpretation of metrics
- Strengths and weaknesses
- Significant patterns

2. RECOMMENDATIONS (3-5 specific actions):
- Prioritized list of actionable improvements
- Focus on critical issues
- Consider both technical and business impact

3. GENERAL CONCLUSIONS (max 100 words):
- Overall assessment of ${category} performance
- Summary of critical priorities
- Expected impact of implementing recommendations

Analysis data:
- Score: ${data.score}%
- Metrics: ${metricsInfo}
- Identified issues: ${issuesInfo}

Format your response in English as:
"Analysis: [your analysis text]
Recommendations:
1. [First recommendation]
2. [Second recommendation]
...
Conclusions: [your conclusions text]"`;
}

function parseAIResponse(content: string): AIAnalysisSection {
  let analysis = content;
  analysis = analysis.replace(/^(Analysis:)\s*/i, "");

  const recommendations: string[] = [];
  const recommendationMatch = content.match(/(Recommendations:)([\s\S]*?)(Conclusions:|$)/i);

  if (recommendationMatch && recommendationMatch[0]) {
    analysis = analysis.replace(recommendationMatch[0], "").trim();
  }

  if (recommendationMatch && recommendationMatch[2]) {
    const recLines = recommendationMatch[2].trim().split(/\n+/);
    for (const line of recLines) {
      const match = line.match(/^\s*\d+\.\s*(.+)$/);
      if (match && match[1]) {
        recommendations.push(match[1].trim());
      } else if (line.trim() && !line.match(/^\s*(\d+\.|Recommendations)/i)) {
        recommendations.push(line.trim());
      }
    }
  }

  const conclusionsMatch = content.match(/(Conclusions:)([\s\S]*)$/i);
  const conclusions = conclusionsMatch && conclusionsMatch[2] ? conclusionsMatch[2].trim() : "";

  return {
    analysis,
    recommendations,
    conclusions,
  };
}

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error(`Failed after ${maxRetries} retries`);
}

async function makeAIRequest(prompt: string): Promise<AIAnalysisSection> {
  try {
    const response = await fetchWithRetry("http://100/ai/openai/v1/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": "sk_api_8f0k1l2m3n4",
      },
      body: JSON.stringify({
        pattern: { cmd: "generate_content" },
        data: {
          type: "seo_report",
          audience: "small businesses",
          main_pain_point: "lack of SEO",
          prompt: prompt,
        },
      }),
    });

    const aiAnalysis: AIAnalysisResponse = await response.json();
    if (aiAnalysis.data?.data?.content) {
      return parseAIResponse(aiAnalysis.data.data.content);
    } else {
      return {
        analysis: "Unable to generate analysis. Please try again later.",
        recommendations: [],
        conclusions: "",
      };
    }
  } catch (error) {
    return {
      analysis: "Error generating AI analysis",
      recommendations: [],
      conclusions: "",
    };
  }
}

export async function getAIAnalysis(pageAnalysis: PageAnalysisResponse): Promise<AIAnalysisResult> {
  const speedCategories = ["performance", "accessibility", "best-practices", "seo"];
  const deviceTypes = ["mobile", "desktop"];
  const sections: Record<string, AIAnalysisSection> = {};
  const categoryRecommendations: Record<string, string[]> = {};
  let fullAnalysis = "";

  let seoAnalysis: AIAnalysisSection = {
    analysis: "",
    recommendations: [],
    conclusions: "",
  };

  let onPageAnalysis: AIAnalysisSection = {
    analysis: "",
    recommendations: [],
    conclusions: "",
  };

  const seoPrompt = generateSEOPrompt(pageAnalysis);
  if (seoPrompt) {
    try {
      seoAnalysis = await makeAIRequest(seoPrompt);
      sections["SEO_SPECIFIC"] = seoAnalysis;
      fullAnalysis += `\n## SEO Analysis\n${seoAnalysis.analysis}\n\nRecommendations:\n${seoAnalysis.recommendations
        .map((rec, i) => `${i + 1}. ${rec}`)
        .join("\n")}\n\nConclusions:\n${seoAnalysis.conclusions}`;
    } catch (error) {
      seoAnalysis = {
        analysis: "Error generating specific SEO analysis",
        recommendations: [],
        conclusions: "",
      };
    }
  }

  const onPagePrompt = generateOnPagePrompt(pageAnalysis);
  if (onPagePrompt) {
    try {
      onPageAnalysis = await makeAIRequest(onPagePrompt);
      sections["ON_PAGE_SPECIFIC"] = onPageAnalysis;
      fullAnalysis += `\n## On-Page Analysis\n${onPageAnalysis.analysis}\n\nRecommendations:\n${onPageAnalysis.recommendations
        .map((rec, i) => `${i + 1}. ${rec}`)
        .join("\n")}\n\nConclusions:\n${onPageAnalysis.conclusions}`;
    } catch (error) {
      onPageAnalysis = {
        analysis: "Error generating specific On-Page analysis",
        recommendations: [],
        conclusions: "",
      };
    }
  }

  for (const category of speedCategories) {
    const categoryRecs = new Set<string>();

    for (const deviceType of deviceTypes) {
      const prompt = generateSpeedPrompt(pageAnalysis, category, deviceType as "mobile" | "desktop");
      if (!prompt) {
        continue;
      }

      const sectionKey = `${deviceType.toUpperCase()}_${normalizeCategory(category)}`;
      try {
        const analysisSection = await makeAIRequest(prompt);
        sections[sectionKey] = analysisSection;
        fullAnalysis += `\n## ${deviceType.toUpperCase()} ${category.toUpperCase()} Analysis\n${analysisSection.analysis}\n\nRecommendations:\n${analysisSection.recommendations
          .map((rec, i) => `${i + 1}. ${rec}`)
          .join("\n")}\n\nConclusions:\n${analysisSection.conclusions}`;
        analysisSection.recommendations.forEach((rec) => categoryRecs.add(rec));
      } catch (error) {
        sections[sectionKey] = {
          analysis: `Error generating AI analysis for ${deviceType} ${category}`,
          recommendations: [],
          conclusions: "",
        };
      }
    }

    const normalizedCategory = normalizeCategory(category);
    categoryRecommendations[normalizedCategory] = Array.from(categoryRecs);
  }

  categoryRecommendations["SEO_SPECIFIC"] = seoAnalysis.recommendations;
  categoryRecommendations["ON_PAGE_SPECIFIC"] = onPageAnalysis.recommendations;

  return {
    sections,
    recommendations: categoryRecommendations,
    fullAnalysis,
    seoAnalysis,
    onPageAnalysis,
  };
}
