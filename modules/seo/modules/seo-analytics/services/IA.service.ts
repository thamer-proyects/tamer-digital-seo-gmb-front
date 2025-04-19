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
}

interface AIAnalysisResult {
  sections: Record<string, AIAnalysisSection>;
  recommendations: Record<string, string[]>;
  fullAnalysis: string;
}

function normalizeCategory(category: string): string {
  return category.replace(/\s+/g, '_').toUpperCase();
}

function generatePromptFromMetrics(
  pageAnalysis: PageAnalysisResponse,
  category: string,
  deviceType: "mobile" | "desktop"
): string {
  const normalizedSearchCategory = category.toLowerCase().replace(/\s+/g, '-');
  const data = pageAnalysis.speed[deviceType].find(
    (cat) => cat.category === normalizedSearchCategory
  );

  if (!data) return "";

  const metricsInfo = data.metrics
    .map((metric: Metric) => `${metric.name}: ${metric.value} (Score: ${metric.score}%)`)
    .join(". ");

  const issuesInfo = data.issues
    .map((issue: Issue) => `${issue.title}: ${issue.description || "No description"}`)
    .join(". ");

  return `Analyze the following SEO performance data for ${deviceType.toUpperCase()} ${normalizeCategory(category)} and provide:

1. ANALYSIS (max 300 words):
- Key findings and metrics interpretation
- Strengths and weaknesses
- Significant patterns

2. RECOMMENDATIONS (3-5 specific actions):
- Prioritized list of actionable improvements
- Focus on critical issues
- Consider both technical and business impact

Analysis data:
- Score: ${data.score}%
- Metrics: ${metricsInfo}
- Identified issues: ${issuesInfo}

Format your response as:
"Analysis: [your analysis text]

Recommendations:
1. [First recommendation]
2. [Second recommendation]
..."`;
}

function parseAIResponse(content: string): AIAnalysisSection {
  const analysisMatch = content.match(/\*\*Análisis:\*\*([\s\S]*?)(?=\*\*Recomendaciones:\*\*|$)/);
  const recommendationsMatch = content.match(/\*\*Recomendaciones:\*\*([\s\S]*?)(?=\*\*|$)/);
  
  const analysis = analysisMatch ? analysisMatch[1].trim() : content.trim();
  let recommendations: string[] = [];
  
  if (recommendationsMatch) {
      recommendations = recommendationsMatch[1]
          .split(/\d+\.\s+/)
          .filter(item => item.trim().length > 0)
          .map(item => item.trim());
  }

  return {
      analysis,
      recommendations
  };
}


// Añadir una función de reintento
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      
      // Si la respuesta no es ok, esperar antes de reintentar
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      // Esperar antes de reintentar
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error(`Failed after ${maxRetries} retries`);
}

// Modificar la función principal para usar el reintento
export async function getAIAnalysis(pageAnalysis: PageAnalysisResponse): Promise<AIAnalysisResult> {
  const categories = ["performance", "accessibility", "best-practices", "seo"];
  const deviceTypes = ["mobile", "desktop"];
  const sections: Record<string, AIAnalysisSection> = {};
  const categoryRecommendations: Record<string, string[]> = {};
  let fullAnalysis = "";

  for (const category of categories) {
    const categoryRecs = new Set<string>();
    
    for (const deviceType of deviceTypes) {
      const prompt = generatePromptFromMetrics(pageAnalysis, category, deviceType as "mobile" | "desktop");
      
      if (!prompt) {
        console.log(`Generando prompt para ${deviceType} ${category}`);
        continue;
      }

      const sectionKey = `${deviceType.toUpperCase()}_${normalizeCategory(category)}`;
      
      try {
        const response = await fetchWithRetry(
          "http://145.223.126.1:10000/ai/openai/v1/api/generate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": "sk_api_8f2e71d9b5a4c3e6f7g8h9j0k1l2m3n4",
            },
            body: JSON.stringify({
              pattern: { cmd: "generate_content" },
              data: {
                type: "seo_report",
                audiencia: "pequeñas empresas",
                dolor_principal: "falta de SEO",
                prompt: prompt,
              },
            }),
          }
        );

        const aiAnalysis: AIAnalysisResponse = await response.json();
        
        if (aiAnalysis.data?.data?.content) {
          const parsedResponse = parseAIResponse(aiAnalysis.data.data.content);
          sections[sectionKey] = parsedResponse;
          fullAnalysis += `\n${aiAnalysis.data.data.content}`;
          
          parsedResponse.recommendations.forEach(rec => categoryRecs.add(rec));
        }
      } catch (error) {
        console.error(`Error en análisis de ${deviceType} ${category}:`, error);
        sections[sectionKey] = {
          analysis: `Error al generar análisis de IA para ${deviceType} ${category}`,
          recommendations: [],
        };
      }
    }

    const normalizedCategory = normalizeCategory(category);
    categoryRecommendations[normalizedCategory] = Array.from(categoryRecs);
  }

  return {
    sections,
    recommendations: categoryRecommendations,
    fullAnalysis,
  };
}