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
  fullAnalysis: string;
}

// Función para normalizar categorías
function normalizeCategory(category: string): string {
  return category.replace(/\s+/g, '_').toUpperCase(); // Reemplaza espacios por guiones bajos y convierte a mayúsculas
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
  const prompt = `
    ${deviceType.toUpperCase()} ${normalizeCategory(category)} Analysis:
    - Score: ${data.score}%
    - Metrics: ${metricsInfo}
    - Issues: ${issuesInfo}
  `;
  console.log(`Prompt enviado para ${deviceType} ${category}:`, prompt); // Log del prompt enviado
  return prompt;
}

// Función para parsear la respuesta de la IA
function parseAIResponse(content: string): AIAnalysisSection {
  const parts = content.split(/Recommendations:|Recomendaciones:/i);
  const analysis = parts[0].trim();
  const recommendations: string[] = [];

  if (parts.length > 1) {
    const recText = parts[1].trim();
    const recItems = recText.split(/\d+\.\s|\n-\s|\n•\s/).filter(Boolean);
    recommendations.push(...recItems.map((item) => item.trim()));
  }

  return {
    analysis,
    recommendations,
  };
}
// Función principal para obtener el análisis de IA
export async function getAIAnalysis(pageAnalysis: PageAnalysisResponse): Promise<AIAnalysisResult> {
  // Usar las categorías exactamente como aparecen en pageAnalysis
  const categories = ["performance", "accessibility", "best-practices", "seo"];
  const deviceTypes = ["mobile", "desktop"];
  const sections: Record<string, AIAnalysisSection> = {};
  let fullAnalysis = "";
  
  console.log("Categorías disponibles en pageAnalysis:", 
    pageAnalysis.speed.mobile.map(cat => cat.category));
  
  for (const category of categories) {
    for (const deviceType of deviceTypes) {
      // Usar la categoría en minúsculas con guiones para buscar
      const prompt = generatePromptFromMetrics(pageAnalysis, category, deviceType as "mobile" | "desktop");
      
      if (!prompt) {
        console.log(`No se pudo generar prompt para ${deviceType} ${category}`);
        continue;
      }
      
      // Para la clave del objeto sections, usar el formato normalizado
      const sectionKey = `${deviceType.toUpperCase()}_${category.replace(/\-/g, '_').toUpperCase()}`;
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
        console.log(`Respuesta recibida de IA para ${deviceType} ${category}:`, aiAnalysis.data.data.content); // Log de la respuesta recibida

        const sectionKey = `${deviceType.toUpperCase()}_${normalizeCategory(category)}`; // Clave normalizada
        const parsedSection = parseAIResponse(aiAnalysis.data.data.content);
        console.log(`Clave generada: ${sectionKey}`);
        sections[sectionKey] = parsedSection;
        fullAnalysis += `\n${aiAnalysis.data.data.content}`;
      } catch (error) {
        console.error(`Error en ${deviceType} ${category}:`, error);
      
        sections[sectionKey] = {
          analysis: "No se pudo generar el análisis de IA.",
          recommendations: [],
        };
      }
    }
  }

  return {
    sections,
    fullAnalysis,
  };
}