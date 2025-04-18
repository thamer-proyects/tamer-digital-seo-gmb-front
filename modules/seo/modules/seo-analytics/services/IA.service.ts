import type { PageAnalysisResponse, Metric, Issue } from "../types/analysisResponse";

// Interfaz para la solicitud al servicio de IA
interface AIAnalysisRequest {
  pattern: {
    cmd: "generate_content";
  };
  data: {
    type: "seo_report";
    audiencia: string;
    dolor_principal: string;
    prompt: string;
  };
}

// Interfaz para la respuesta del servicio de IA
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

// Interfaz para una sección del análisis de IA
interface AIAnalysisSection {
  analysis: string;
  recommendations: string[];
}

// Interfaz para el resultado completo del análisis de IA
interface AIAnalysisResult {
  sections: Record<string, AIAnalysisSection>;
  recommendations: Record<string, string[]>; // Añadimos recomendaciones generales por categoría
  fullAnalysis: string;
}

// Función para normalizar categorías
function normalizeCategory(category: string): string {
  return category.replace(/\s+/g, '_').toUpperCase(); // Reemplaza espacios por guiones bajos y convierte a mayúsculas
}
function generateOnPageScorePrompt(pageAnalysis: PageAnalysisResponse): string {
  const metrics = pageAnalysis.seo.page_metrics;
  
  return `Analyze the following On-page Score metrics and provide insights:
    - Overall Score: ${metrics.onpage_score * 100}%
    - External Links: ${metrics.links_external}
    - Internal Links: ${metrics.links_internal}
    - Duplicate Titles: ${metrics.duplicate_title}
    - Duplicate Descriptions: ${metrics.duplicate_description}
    - Broken Links: ${metrics.broken_links}
    - Non-indexable Pages: ${metrics.non_indexable}

    Provide a detailed analysis focusing on:
    1. Score interpretation and its impact on SEO
    2. Link structure evaluation
    3. Content uniqueness assessment
    4. Technical SEO elements
    5. Specific recommendations for improvement

    IMPORTANT INSTRUCTIONS:
    - Maintain a professional and objective tone
    - Use clear and direct language
    - Focus on actionable insights
    - Structure the response in clear sections

    Response Format:
    Start your response with "Analysis:" followed by your detailed assessment.
    IMPORTANT: Provide the response in English.`;
}
// Función para generar el prompt a partir de las métricas y problemas reales
function generatePromptFromMetrics(
  pageAnalysis: PageAnalysisResponse,
  category: string,
  deviceType: "mobile" | "desktop"
): string {
  // Convertir la categoría a minúsculas y con guiones para coincidir con el formato en pageAnalysis
  const normalizedSearchCategory = category.toLowerCase().replace(/\s+/g, '-');
  
  const data = pageAnalysis.speed[deviceType].find(
    (cat) => cat.category === normalizedSearchCategory
  );
  
  if (!data) {
    console.log(`No se encontró la categoría ${normalizedSearchCategory} en ${deviceType}`);
    return "";
  }

  // Generar texto de métricas
  const metricsInfo = data.metrics
    .map((metric: Metric) => `${metric.name}: ${metric.value} (Score: ${metric.score}%)`)
    .join(". ");

  // Generar texto de problemas
  const issuesInfo = data.issues
    .map((issue: Issue) => `${issue.title}: ${issue.description || "Sin descripción"}`)
    .join(". ");

  // Prompt estructurado
  const prompt = ` Analyze the following SEO performance data for ${deviceType.toUpperCase()} ${normalizeCategory(category)} and generate a concise executive summary of NO MORE THAN 300 WORDS. The summary should include:

1. Key Findings: Identify the most important points from the analysis.
2. Metrics Interpretation: Briefly explain the meaning of key metrics mentioned.
3. Strengths and Weaknesses: Highlight positive aspects and areas for improvement.
4. Trends: Mention significant patterns or trends if evident.

Analysis Data:
- Score: ${data.score}%
- Metrics: ${metricsInfo}
- Identified Issues: ${issuesInfo}

IMPORTANT INSTRUCTIONS:
- Maintain a professional and objective tone
- Use clear and direct language, avoiding excessive technical jargon
- Focus ONLY on the provided information, without making additional assumptions
- Structure the summary in 2-3 paragraphs for easy reading

Response Format:
Start your response with "Analysis:" followed by your executive summary.

IMPORTANT: Provide the response in English.`;

  return prompt;
}

// Función para generar prompt de recomendaciones generales por categoría
function generateCategoryRecommendationsPrompt(
  pageAnalysis: PageAnalysisResponse,
  category: string
): string {
  // Convertir la categoría a minúsculas y con guiones para coincidir con el formato en pageAnalysis
  const normalizedSearchCategory = category.toLowerCase().replace(/\s+/g, '-');
  
  const mobileData = pageAnalysis.speed.mobile.find(
    (cat) => cat.category === normalizedSearchCategory
  );
  
  const desktopData = pageAnalysis.speed.desktop.find(
    (cat) => cat.category === normalizedSearchCategory
  );
  
  if (!mobileData || !desktopData) {
    console.log(`No se encontraron datos completos para la categoría ${normalizedSearchCategory}`);
    return "";
  }

  // Generar texto de problemas para ambos dispositivos
  const mobileIssues = mobileData.issues
    .map((issue: Issue) => `Mobile - ${issue.title}: ${issue.description || "Sin descripción"}`)
    .join(". ");

  const desktopIssues = desktopData.issues
    .map((issue: Issue) => `Desktop - ${issue.title}: ${issue.description || "Sin descripción"}`)
    .join(". ");

  // Prompt estructurado para recomendaciones generales
  
  const prompt = ` Based on the following issues identified for both mobile and desktop devices in the ${category.toUpperCase()} category, generate a list of 3-5 prioritized and actionable recommendations.

Mobile Device Issues:
- Score: ${mobileData.score}%
- ${mobileIssues}

Desktop Device Issues:
- Score: ${desktopData.score}%
- ${desktopIssues}

IMPORTANT INSTRUCTIONS:
- Provide recommendations that address the most critical issues identified across both device types
- Ensure recommendations are specific, actionable, and relevant to the provided data
- Prioritize recommendations that would benefit both mobile and desktop versions
- Include at least one specific recommendation for mobile and one for desktop where relevant

Response Format:
Provide ONLY a numbered list of recommendations without introductory text.

IMPORTANT: Provide the response in English.`;

  return prompt;
}

// Función para parsear la respuesta de la IA
function parseAIResponse(content: string, isOnPageScore: boolean = false): AIAnalysisSection {
  const analysis = content.replace(/^Analysis:\s*/i, "").trim();
  
  if (isOnPageScore) {
    // Extract recommendations from the On-page Score analysis
    const recommendations = content
      .split(/(?:\d+\.|\n-|\n•)/)
      .filter(item => item.includes('recommend') || item.includes('should') || item.includes('improve'))
      .map(item => item.trim())
      .filter(item => item.length > 0);

    return {
      analysis,
      recommendations
    };
  }

  return {
    analysis,
    recommendations: []
  };
}

// Función para parsear recomendaciones generales
function parseRecommendations(content: string): string[] {
  return content
    .split(/(?:\d+\.|\n-|\n•)/)
    .map(item => item.trim())
    .filter(item => item.length > 0);
}

// Función principal para obtener el análisis de IA
export async function getAIAnalysis(pageAnalysis: PageAnalysisResponse): Promise<AIAnalysisResult> {
  // Usar las categorías exactamente como aparecen en pageAnalysis
  const categories = ["performance", "accessibility", "best-practices", "seo"];
  const deviceTypes = ["mobile", "desktop"];
  const sections: Record<string, AIAnalysisSection> = {};
  const categoryRecommendations: Record<string, string[]> = {};
  let fullAnalysis = "";
  
  console.log("Categorías disponibles en pageAnalysis:", 
    pageAnalysis.speed.mobile.map(cat => cat.category));

 // First analyze On-page Score
    if (pageAnalysis.seo?.page_metrics) {
      const onPagePrompt = generateOnPageScorePrompt(pageAnalysis);
      try {
        const response = await fetch("http://145.223.126.1:10000/ai/openai/v1/api/generate", {
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
              prompt: onPagePrompt,
            },
          }),
        });
  
        const aiAnalysis: AIAnalysisResponse = await response.json();
        console.log(`on page recibidas para ${aiAnalysis}:`, aiAnalysis.data.data.content);
        sections['ON_PAGE_SCORE'] = parseAIResponse(aiAnalysis.data.data.content);
        fullAnalysis += `\n${aiAnalysis.data.data.content}`;
        categoryRecommendations['ON_PAGE_SCORE'] = sections['ON_PAGE_SCORE'].recommendations;
      } catch (error) {
        console.error('Error al analizar On-page Score:', error);
        sections['ON_PAGE_SCORE'] = {
          analysis: "No se pudo generar el análisis del On-page Score.",
          recommendations: [],
        };
      }
    }
  
  // Primero procesar los análisis por dispositivo y categoría
  for (const category of categories) {
    for (const deviceType of deviceTypes) {
      const prompt = generatePromptFromMetrics(pageAnalysis, category, deviceType as "mobile" | "desktop");
      
      if (!prompt) {
        console.log(`No se pudo generar prompt para ${deviceType} ${category}`);
        continue;
      }
      
      const sectionKey = `${deviceType.toUpperCase()}_${normalizeCategory(category)}`;
      console.log(`Generando análisis para sección: ${sectionKey}`);
      
      const requestBody: AIAnalysisRequest = {
        pattern: {
          cmd: "generate_content",
        },
        data: {
          type: "seo_report",
          audiencia: "pequeñas empresas",
          dolor_principal: "falta de SEO",
          prompt: prompt,
        },
      };

      try {
        const response = await fetch("http://145.223.126.1:10000/ai/openai/v1/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": "sk_api_8f2e71d9b5a4c3e6f7g8h9j0k1l2m3n4",
          },
          body: JSON.stringify(requestBody),
        });

        const aiAnalysis: AIAnalysisResponse = await response.json();
        console.log(`Respuesta recibida de IA para ${deviceType} ${category}:`, aiAnalysis.data.data.content);

        sections[sectionKey] = parseAIResponse(aiAnalysis.data.data.content);
        fullAnalysis += `\n${aiAnalysis.data.data.content}`;
      } catch (error) {
        console.error(`Error en ${deviceType} ${category}:`, error);
      
        sections[sectionKey] = {
          analysis: "No se pudo generar el análisis de IA.",
          recommendations: [],
        };
      }
    }
    
    // Luego, generar recomendaciones generales por categoría
    const recommendationsPrompt = generateCategoryRecommendationsPrompt(pageAnalysis, category);
    
    if (recommendationsPrompt) {
      try {
        const requestBody: AIAnalysisRequest = {
          pattern: {
            cmd: "generate_content",
          },
          data: {
            type: "seo_report",
            audiencia: "pequeñas empresas",
            dolor_principal: "falta de SEO",
            prompt: recommendationsPrompt,
          },
        };
        
        const response = await fetch("http://145.223.126.1:10000/ai/openai/v1/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": "sk_api_8f2e71d9b5a4c3e6f7g8h9j0k1l2m3n4",
          },
          body: JSON.stringify(requestBody),
        });
        
        const aiRecommendations: AIAnalysisResponse = await response.json();
        console.log(`Recomendaciones recibidas para ${category}:`, aiRecommendations.data.data.content);
        
        const normalizedCategory = normalizeCategory(category);
        categoryRecommendations[normalizedCategory] = parseRecommendations(aiRecommendations.data.data.content);
      } catch (error) {
        console.error(`Error al generar recomendaciones para ${category}:`, error);
        categoryRecommendations[normalizeCategory(category)] = ["No se pudieron generar recomendaciones."];
      }
    }
  }

  return {
    sections,
    recommendations: categoryRecommendations,
    fullAnalysis,
  };
}