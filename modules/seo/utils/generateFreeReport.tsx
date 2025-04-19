import jsPDF from "jspdf"
import type { PageAnalysisResponse, Metric } from "../modules/seo-analytics/types/analysisResponse"
import { getAIAnalysis } from "../modules/seo-analytics/services/IA.service"

interface EnhancedPageAnalysisResponse extends PageAnalysisResponse {
  aiAnalysis?: {
    sections: Record<
      string,
      {
        analysis: string
        recommendations: string[]
      }
    >
    fullAnalysis: string
  }
  companyInfo?: {
    logo: string | null
    name: string
    contactEmail: string
    contactPhone: string
    website: string
  }
}

export async function generateFreeReportPDF(pageAnalysis: EnhancedPageAnalysisResponse): Promise<void> {
  // Create PDF document
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // Obtener el análisis de IA
  const aiAnalysisResult = await getAIAnalysis(pageAnalysis)

  // Imprimir todas las claves disponibles para depuración
  console.log("Claves disponibles en aiAnalysisResult.sections:", Object.keys(aiAnalysisResult.sections))

  // Page dimensions
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  // Color palette - Basado en el diseño del tercer ejemplo (SEO report)
  const colors = {
    background: "#FFFFFF",
    primary: "#0A2540", // Azul oscuro para encabezados (como en el reporte SEO)
    secondary: "#3498DB", // Azul medio para subencabezados
    accent: "#FFD700", // Amarillo/dorado para acentos (como en el logo del reporte SEO)
    text: "#333333", // Texto principal
    lightText: "#666666", // Texto secundario
    good: "#0CCE6B", // Puntuaciones buenas (verde)
    average: "#FFA400", // Puntuaciones medias (ámbar)
    poor: "#FF4E42", // Puntuaciones bajas (rojo)
    border: "#E0E0E0", // Bordes
    lightBg: "#F5F7FA", // Fondo claro
    sectionBg: "#EEF2F7", // Fondo de sección
    headerBg: "#0A2540", // Fondo de encabezado (azul oscuro)
    coverBg: "#FFFFFF", // Fondo de portada (blanco)
    coverAccent: "#3498DB", // Color de acento de portada
  }

  // Tracking current position and page number
  let currentY = 25
  let pageNumber = 1
  let totalPages = 0

  // Helper functions
  const truncateText = (text: string, maxLength: number): string => {
    return text?.length > maxLength ? text.substring(0, maxLength) + "..." : text || ""
  }

  // Check if we need a new page
  const checkSpace = (requiredHeight: number) => {
    if (currentY + requiredHeight > pageHeight - 25) {
      pdf.addPage()
      pageNumber++
      currentY = 25
      drawHeader()
    }
  }

  // Función para obtener el análisis de IA para una categoría y dispositivo

  // Implementar la nueva función drawCoverPage() con el diseño profesional
  const drawCoverPage = () => {
    // Asegurarnos de que estamos en la primera página
    pdf.setPage(1)
  
    // Limpiar completamente la página (fondo blanco)
    pdf.setFillColor("#FFFFFF")
    pdf.rect(0, 0, pageWidth, pageHeight, "F")
  
    // Obtener el contexto para dibujar formas más complejas
    const ctx = pdf.context2d
  
    // Dibujar formas geométricas azules y grises
    // Triángulo azul oscuro
    ctx.fillStyle = "#0A4D8C"
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(pageWidth * 0.5, 0)
    ctx.lineTo(0, pageHeight)
    ctx.closePath()
    ctx.fill()
  
    // Triángulo azul claro
    ctx.fillStyle = "#1E90FF"
    ctx.beginPath()
    ctx.moveTo(0, pageHeight * 0.7)
    ctx.lineTo(pageWidth * 0.4, 0)
    ctx.lineTo(pageWidth * 0.5, 0)
    ctx.lineTo(0, pageHeight)
    ctx.closePath()
    ctx.fill()
  
    // Triángulo gris
    ctx.fillStyle = "#D3D3D3"
    ctx.beginPath()
    ctx.moveTo(pageWidth * 0.4, 0)
    ctx.lineTo(pageWidth * 0.5, 0)
    ctx.lineTo(pageWidth * 0.1, pageHeight)
    ctx.lineTo(0, pageHeight)
    ctx.closePath()
    ctx.fill()
  
    // Logo y nombre de la compañía (en la esquina superior derecha)
    try {
      const logoSize = 20
      const logoX = pageWidth - 30
      const logoY = 20
  
      if (pageAnalysis.companyInfo?.logo) {
        pdf.addImage(
          pageAnalysis.companyInfo.logo,
          "PNG",
          logoX - logoSize / 2,
          logoY - logoSize / 2,
          logoSize,
          logoSize
        )
      } else {
        // Logo circular predeterminado
        ctx.strokeStyle = "#0088CC"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(logoX, logoY, logoSize / 2, 0, Math.PI * 2, false)
        ctx.stroke()
      }
  
      // Texto "YOUR LOGO"
      pdf.setTextColor("#666666")
      pdf.setFontSize(10)
      pdf.setFont("helvetica", "bold")
      pdf.text("YOUR LOGO", logoX - 60, logoY - 5)
  
      // Texto "COMPANY NAME"
      const companyName = pageAnalysis.companyInfo?.name || "COMPANY NAME"
      pdf.setTextColor("#666666")
      pdf.setFontSize(9)
      pdf.setFont("helvetica", "normal")
      pdf.text(companyName, logoX - 60, logoY + 5)
    } catch (error) {
      console.error("Error loading logo:", error)
    }
  
    // Título "BROCHURE"
    pdf.setTextColor("#333333")
    pdf.setFontSize(50)
    pdf.setFont("helvetica", "bold")
    pdf.text("BROCHURE", pageWidth * 0.55, pageHeight * 0.4)
  
    // Título "DESIGN" en azul
    pdf.setTextColor("#0088CC")
    pdf.setFontSize(50)
    pdf.setFont("helvetica", "bold")
    pdf.text("DESIGN", pageWidth * 0.55, pageHeight * 0.5)
  
    // Subtítulo
    pdf.setTextColor("#666666")
    pdf.setFontSize(14)
    pdf.setFont("helvetica", "normal")
    pdf.text("TEMPLATE FLYER YOUR TEXT HERE", pageWidth * 0.55, pageHeight * 0.57)
  
    // Texto Lorem ipsum
    pdf.setTextColor("#999999")
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "italic")
    const loremText =
      '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."'
    const loremLines = pdf.splitTextToSize(loremText, pageWidth * 0.4)
    pdf.text(loremLines, pageWidth * 0.55, pageHeight * 0.63)
  
    // Círculos inferiores con texto
    const circleY = pageHeight * 0.85
    const circleRadius = 5
    const circleSpacing = 30
  
    // Círculo 1
    ctx.beginPath()
    ctx.arc(pageWidth * 0.55, circleY, circleRadius, 0, Math.PI * 2, false)
    ctx.fillStyle = "#666666"
    ctx.fill()
  
    // Círculo 2
    ctx.beginPath()
    ctx.arc(pageWidth * 0.55 + circleSpacing, circleY, circleRadius, 0, Math.PI * 2, false)
    ctx.fillStyle = "#666666"
    ctx.fill()
  
    // Círculo 3
    ctx.beginPath()
    ctx.arc(pageWidth * 0.55 + circleSpacing * 2, circleY, circleRadius, 0, Math.PI * 2, false)
    ctx.fillStyle = "#666666"
    ctx.fill()
  
    // Textos debajo de los círculos
    pdf.setTextColor("#666666")
    pdf.setFontSize(8)
    pdf.setFont("helvetica", "normal")
    pdf.text("CREATIVE", pageWidth * 0.55 - 15, circleY + 15)
    pdf.text("INNOVATION", pageWidth * 0.55 + circleSpacing - 15, circleY + 15)
    pdf.text("TEAMWORK", pageWidth * 0.55 + circleSpacing * 2 - 15, circleY + 15)
  
    // Información de contacto en la parte inferior
    const contactInfo = {
      email: pageAnalysis.companyInfo?.contactEmail || "contact@example.com",
      phone: pageAnalysis.companyInfo?.contactPhone || "+1 234 567 890",
      website: pageAnalysis.companyInfo?.website || "www.example.com",
    }
  
    // Añadir información de contacto de manera sutil en la parte inferior
    pdf.setFontSize(8)
    pdf.setTextColor("#999999")
    pdf.text(
      `Email: ${contactInfo.email} | Phone: ${contactInfo.phone} | Web: ${contactInfo.website}`,
      pageWidth * 0.5,
      pageHeight - 10,
      { align: "center" }
    )
  }
  // Mantener la función drawHeader como estaba, pero con colores actualizados
  const drawHeader = () => {
    // Fondo blanco para el encabezado
    pdf.setFillColor("#FFFFFF")
    pdf.rect(0, 0, pageWidth, 20, "F")

    // Línea decorativa en la parte inferior del encabezado
    pdf.setDrawColor("#E2E8F0")
    pdf.setLineWidth(0.5)
    pdf.line(0, 20, pageWidth, 20)

    // Logo simplificado
    try {
      const logoWidth = 15
      const logoHeight = 15
      const logoX = 10
      const logoY = 2.5

      if (pageAnalysis.companyInfo?.logo) {
        pdf.addImage(pageAnalysis.companyInfo.logo, "PNG", logoX, logoY, logoWidth, logoHeight)
      } else {
        // Logo simplificado
        const ctx = pdf.context2d

        // Círculo principal
        ctx.beginPath()
        const pointX = pageWidth / 2 - 20 // Ajusta según sea necesario
        const pointY = currentY + 10 // Ajusta según sea necesario
        ctx.arc(pointX, pointY, 1.5, 0, Math.PI * 2, false)
        ctx.fillStyle = "#3164AD"
        ctx.fill()

        // Círculo secundario
        ctx.beginPath()
        const point2X = pageWidth / 2 + 20 // Ajusta según sea necesario
        const point2Y = currentY + 10 // Ajusta según sea necesario
        ctx.arc(point2X, point2Y, 1.5, 0, Math.PI * 2, false)
        ctx.fillStyle = "#F97316"
        ctx.fill()
      }
    } catch (error) {
      console.error("Error loading logo in header:", error)
    }

    // Título del reporte
    pdf.setTextColor("#0F2C52")
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "bold")
    pdf.text("Website Performance Report", 30, 13)

    // URL analizada
    pdf.setFontSize(8)
    pdf.setFont("helvetica", "normal")
    pdf.setTextColor("#666666")
    pdf.text(`URL: ${truncateText(pageAnalysis.url, 60)}`, 30, 18)

    // Fecha de generación
    const date = new Date().toLocaleDateString()
    pdf.text(`Generated: ${date}`, pageWidth - 15, 13, { align: "right" })
  }

  // Draw footer
  const drawFooter = (pageNum: number, totalPgs: number) => {
    // No dibujar el pie de página en la portada (página 1)
    if (pageNum === 1) return

    pdf.setDrawColor(colors.border)
    pdf.setLineWidth(0.5)
    pdf.line(10, pageHeight - 10, pageWidth - 10, pageHeight - 10)
    pdf.setTextColor(colors.lightText)
    pdf.setFontSize(8)
    pdf.text(pageAnalysis.companyInfo?.name || "SEO Analysis Report", 10, pageHeight - 5)
    // Ajustar la numeración para que la portada no cuente
    pdf.text(`Page ${pageNum - 1} of ${totalPgs - 1}`, pageWidth - 10, pageHeight - 5, { align: "right" })
  }

  // Draw section header
  const drawSectionHeader = (title: string) => {
    checkSpace(15)

    // Gradiente para el encabezado de sección
    const ctx = pdf.context2d
    const gradient = ctx.createLinearGradient(10, currentY, pageWidth - 10, currentY)
    gradient.addColorStop(0, colors.primary)
    gradient.addColorStop(1, colors.secondary)
    ctx.fillStyle = gradient
    ctx.fillRect(10, currentY, pageWidth - 20, 10)

    pdf.setTextColor("#FFFFFF")
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "bold")
    pdf.text(title, 15, currentY + 7)
    currentY += 15
  }
  const getAIAnalysisForSection = (category: string, deviceType: string) => {
    const normalizedCategory = category.replace(/-/g, "_").toUpperCase();
    const sectionKey = `${deviceType.toUpperCase()}_${normalizedCategory}`;
  
    console.log(`Buscando análisis IA para: ${sectionKey}`);
  
    if (!aiAnalysisResult.sections || !aiAnalysisResult.sections[sectionKey]) {
      const alternativeKeys = Object.keys(aiAnalysisResult.sections || {}).filter(
        (key) => key.includes(deviceType.toUpperCase()) && key.includes(category.toUpperCase().replace(/-/g, "_"))
      );
  
      if (alternativeKeys.length > 0) {
        const alternativeKey = alternativeKeys[0];
        console.log(`Usando clave alternativa: ${alternativeKey}`);
        return aiAnalysisResult.sections[alternativeKey];
      }
  
      console.log(`No se encontraron análisis para ${category} ${deviceType}`);
      return null;
    }
  
    return aiAnalysisResult.sections[sectionKey];
  };
  // Draw recommendations section
  const drawRecommendations = (category: string, score: number) => {
    checkSpace(15);
    pdf.setFillColor(colors.good);
    pdf.rect(15, currentY, pageWidth - 30, 8, "F");
    pdf.setTextColor("#FFFFFF");
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("Recomendaciones para Mejorar", 20, currentY + 6);
    currentY += 12;
  
    const normalizedCategory = category.replace(/-/g, "_").toUpperCase();
    let recommendations: string[] = [];
  
    // Obtener recomendaciones para esta categoría
    if (aiAnalysisResult.recommendations && aiAnalysisResult.recommendations[normalizedCategory]) {
      const uniqueRecommendations = Array.from(new Set(aiAnalysisResult.recommendations[normalizedCategory]));
      recommendations = uniqueRecommendations;
    } else {
      console.log(`No se encontraron recomendaciones para ${normalizedCategory}`);
    }
  
    pdf.setTextColor(colors.text);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
  
    if (recommendations.length === 0) {
      const noRecommendationText = "No hay recomendaciones específicas para esta categoría.";
      pdf.text(noRecommendationText, 20, currentY + 4);
      currentY += 10;
    } else {
      recommendations.forEach((recommendation, index) => {
        checkSpace(10);
        const bulletPoint = `${index + 1}. `;
        const textWidth = pageWidth - 50;
        const recommendationLines = pdf.splitTextToSize(recommendation, textWidth - pdf.getTextWidth(bulletPoint));
  
        pdf.text(bulletPoint, 20, currentY + 4);
        pdf.text(recommendationLines, 20 + pdf.getTextWidth(bulletPoint), currentY + 4);
  
        currentY += recommendationLines.length * 5 + 3;
      });
    }
  
    currentY += 5;
  };
  // Draw device comparison chart - Corregido para evitar que se corte
  const drawDeviceComparisonChart = (mobileScore: number, desktopScore: number, category: string) => {
    // Calcular la altura total necesaria para todo el gráfico y sus elementos
    const totalChartHeight = 250 // Aumentado para asegurar que todo quepa

    // Verificar si hay suficiente espacio, si no, crear una nueva página
    checkSpace(totalChartHeight)

    pdf.setTextColor(colors.text)
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "bold")
    pdf.text(`${category} - Device Comparison`, 15, currentY + 6)
    currentY += 20

    const chartX = 20
    const chartY = currentY
    const chartWidth = pageWidth - 40
    const chartHeight = 60

    pdf.setFillColor("#f8fafc")
    pdf.rect(chartX, chartY, chartWidth, chartHeight, "F")

    pdf.setDrawColor("#e2e8f0")
    pdf.setLineWidth(0.2)

    for (let i = 0; i <= 4; i++) {
      const y = chartY + chartHeight - (i * chartHeight) / 4
      pdf.line(chartX, y, chartX + chartWidth, y)
      pdf.setTextColor("#94a3b8")
      pdf.setFontSize(7)
      pdf.text(`${i * 25}%`, chartX - 10, y + 2)
    }

    const getMobileMetrics = () => {
      const mobileCategory = pageAnalysis.speed.mobile.find((cat) => cat.category === category)
      return mobileCategory?.metrics || []
    }

    const getDesktopMetrics = () => {
      const desktopCategory = pageAnalysis.speed.desktop.find((cat) => cat.category === category)
      return desktopCategory?.metrics || []
    }

    const getMetricValue = (metrics: Metric[], metricName: string): number => {
      const metric = metrics.find((m) => m.name.toLowerCase().includes(metricName.toLowerCase()))
      return metric ? metric.score / 100 : 0
    }

    const mobileMetrics = getMobileMetrics()
    const desktopMetrics = getDesktopMetrics()

    const metrics = [
      {
        name: "Initial",
        mobile: mobileScore,
        desktop: desktopScore,
      },
      {
        name: "FCP",
        mobile: getMetricValue(mobileMetrics, "First Contentful Paint"),
        desktop: getMetricValue(desktopMetrics, "First Contentful Paint"),
      },
      {
        name: "LCP",
        mobile: getMetricValue(mobileMetrics, "Largest Contentful Paint"),
        desktop: getMetricValue(desktopMetrics, "Largest Contentful Paint"),
      },
      {
        name: "TTI",
        mobile: getMetricValue(mobileMetrics, "Time to Interactive"),
        desktop: getMetricValue(desktopMetrics, "Time to Interactive"),
      },
      {
        name: "CLS",
        mobile: getMetricValue(mobileMetrics, "Cumulative Layout Shift"),
        desktop: getMetricValue(desktopMetrics, "Cumulative Layout Shift"),
      },
      {
        name: "FID",
        mobile: getMetricValue(mobileMetrics, "First Input Delay"),
        desktop: getMetricValue(desktopMetrics, "First Input Delay"),
      },
      {
        name: "Overall",
        mobile: mobileScore,
        desktop: desktopScore,
      },
    ]

    metrics.forEach((metric, i) => {
      const x = chartX + i * (chartWidth / (metrics.length - 1))
      pdf.line(x, chartY, x, chartY + chartHeight)
      pdf.setTextColor("#64748b")
      pdf.setFontSize(8)
      pdf.text(metric.name, x - 8, chartY + chartHeight + 10)
    })

    const ctx = pdf.context2d

    // Línea de Desktop
    ctx.beginPath()
    ctx.strokeStyle = "#1E88E5"
    ctx.lineWidth = 0.5
    metrics.forEach((metric, i) => {
      const x = chartX + i * (chartWidth / (metrics.length - 1))
      const y = chartY + chartHeight - metric.desktop * chartHeight
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.stroke()

    // Puntos de Desktop
    metrics.forEach((metric, i) => {
      const x = chartX + i * (chartWidth / (metrics.length - 1))
      const y = chartY + chartHeight - metric.desktop * chartHeight
      ctx.beginPath()
      ctx.fillStyle = "#1E88E5"
      ctx.arc(x, y, 1.5, 0, Math.PI * 2, false) // Tamaño reducido
      ctx.fill()
    })

    // Línea de Mobile
    ctx.beginPath()
    ctx.strokeStyle = "#0CCE6B"
    ctx.lineWidth = 0.5
    metrics.forEach((metric, i) => {
      const x = chartX + i * (chartWidth / (metrics.length - 1))
      const y = chartY + chartHeight - metric.mobile * chartHeight
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.stroke()

    // Puntos de Mobile
    metrics.forEach((metric, i) => {
      const x = chartX + i * (chartWidth / (metrics.length - 1))
      const y = chartY + chartHeight - metric.mobile * chartHeight
      ctx.beginPath()
      ctx.fillStyle = "#0CCE6B"
      ctx.arc(x, y, 1.5, 0, Math.PI * 2, false) // Tamaño reducido
      ctx.fill()
    })

    // Enhanced legend
    const legendY = chartY + chartHeight + 25

    // Legend frame
    pdf.setFillColor("#fafafa")
    pdf.setDrawColor("#e0e0e0")
    pdf.roundedRect(chartX, legendY - 5, chartWidth, 15, 2, 2, "FD")

    // Desktop indicator
    ctx.beginPath()
    ctx.fillStyle = "#1E88E5" // Blue color for desktop
    ctx.arc(chartX + 10, legendY, 3, 0, Math.PI * 2, false)
    ctx.fill()

    pdf.setTextColor("#333333")
    pdf.setFontSize(9)
    pdf.setFont("helvetica", "bold")
    pdf.text(`Desktop: ${Math.round(desktopScore * 100)}%`, chartX + 17, legendY + 3)

    // Mobile indicator
    ctx.beginPath()
    ctx.fillStyle = "#0CCE6B" // Green color for mobile
    ctx.arc(chartX + 100, legendY, 3, 0, Math.PI * 2, false)
    ctx.fill()

    pdf.text(`Mobile: ${Math.round(mobileScore * 100)}%`, chartX + 107, legendY + 3)

    // Improved description
    pdf.setFillColor("#f5f5f5")
    pdf.roundedRect(chartX, legendY + 15, chartWidth, 15, 2, 2, "F")

    pdf.setTextColor("#777777")
    pdf.setFontSize(8)
    pdf.setFont("helvetica", "italic")
    pdf.text(
      "This chart compares performance between mobile and desktop devices. Higher values indicate better performance.",
      chartX + 15,
      legendY + 22,
    )

    // Metrics explanation table
    const metricsLegendY = legendY + 35
    pdf.setTextColor("#333333")
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "bold")
    pdf.text("Metrics Legend:", chartX, metricsLegendY)
    currentY = metricsLegendY + 5

    // Create table with borders
    pdf.setFillColor("#fafafa")
    pdf.setDrawColor("#e0e0e0")
    pdf.roundedRect(chartX, currentY, chartWidth, 85, 2, 2, "FD")

    currentY += 5

    const metricsExplanation = [
      { abbr: "Initial", desc: "Initial load of the page when the browser begins processing." },
      {
        abbr: "FCP",
        desc: "First Contentful Paint - Time until first content (text, image) is rendered.",
      },
      {
        abbr: "LCP",
        desc: "Largest Contentful Paint - Time until largest content element is visible.",
      },
      {
        abbr: "TTI",
        desc: "Time to Interactive - When the page becomes fully interactive for the user.",
      },
      {
        abbr: "CLS",
        desc: "Cumulative Layout Shift - Measures visual stability during page load (lower is better).",
      },
      {
        abbr: "FID",
        desc: "First Input Delay - Time from first interaction to browser's response.",
      },
      { abbr: "Overall", desc: "Combined score of all performance metrics." },
    ]

    metricsExplanation.forEach((item, index) => {
      // Alternating row background
      if (index % 2 === 1) {
        pdf.setFillColor("#f5f5f5")
        pdf.rect(chartX + 5, currentY - 2, chartWidth - 10, 10, "F")
      }

      // Abbreviation
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor("#444444")
      pdf.text(item.abbr + ":", chartX + 10, currentY + 4)

      // Description
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor("#666666")
      const descLines = pdf.splitTextToSize(item.desc, chartWidth - 50)
      pdf.text(descLines, chartX + 40, currentY + 4)

      currentY += 12
    })

    currentY += 10

    return { mobileScore, desktopScore }
  }

  // Función mejorada para dibujar el círculo de progreso con análisis de IA
// Modificar la función drawCircleProgress en paste.txt para que no muestre las recomendaciones
const drawCircleProgress = (score: number, label: string, x = 30, radius = 15) => {
  checkSpace(radius * 2 + 15);
  
  const scorePercentage = Math.round(score * 100);
  
  pdf.setTextColor(colors.text);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text(label, 15, currentY + 6);
  
  currentY += 15;
  
  const ctx = pdf.context2d;
  
  ctx.beginPath();
  ctx.arc(x, currentY + radius, radius, 0, Math.PI * 2, false);
  ctx.fillStyle = "#f1f5f9";
  ctx.fill();
  
  let gradientStart, gradientEnd;
  if (score >= 0.9) {
    gradientStart = "#10b981";
    gradientEnd = "#14b8a6";
  } else if (score >= 0.5) {
    gradientStart = "#f59e0b";
    gradientEnd = "#f97316";
  } else {
    gradientStart = "#e11d48";
    gradientEnd = "#dc2626";
  }
  
  const grd = ctx.createLinearGradient(x - radius, currentY + radius, x + radius, currentY + radius);
  grd.addColorStop(0, gradientStart);
  grd.addColorStop(1, gradientEnd);
  
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + score * Math.PI * 2;
  ctx.beginPath();
  ctx.moveTo(x, currentY + radius);
  ctx.arc(x, currentY + radius, radius, startAngle, endAngle, false);
  ctx.lineTo(x, currentY + radius);
  ctx.fillStyle = grd;
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(x, currentY + radius, radius * 0.65, 0, Math.PI * 2, false);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(x, currentY + radius, radius + 5, startAngle, endAngle, false);
  ctx.strokeStyle = grd;
  ctx.lineWidth = 1;
  ctx.stroke();
  
  let scoreText = `${scorePercentage}`;
  if (scoreText.length > 3) {
    scoreText = scoreText.substring(0, 2);
  }
  scoreText += "%";
  
  pdf.setTextColor(gradientStart);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  const textWidth = pdf.getTextWidth(scoreText);
  pdf.text(scoreText, x - textWidth / 2, currentY + radius + 3);
  
  // Extraer categoría y tipo de dispositivo
  const deviceType = label.toLowerCase().includes("mobile") ? "mobile" : "desktop";
  let category = label.toLowerCase().replace(`${deviceType} - `, "").replace(/\s+/g, "-");
  if (label.includes("On-page Score")) {
    category = "seo";
  }
  
  // Obtener análisis de IA
  const aiAnalysis = getAIAnalysisForSection(category, deviceType);
  
  // Renderizar solo el análisis a la derecha del círculo
  const descriptionX = x + radius * 2 + 10;
  const descriptionWidth = pageWidth - descriptionX - 15;
  
  if (aiAnalysis && aiAnalysis.analysis) {
    pdf.setTextColor(colors.lightText);
    pdf.setFontSize(8);
    // Mostrar solo el texto del análisis sin etiquetas ni recomendaciones
    const analysisLines = pdf.splitTextToSize(aiAnalysis.analysis, descriptionWidth);
    pdf.text(analysisLines, descriptionX, currentY + 5);
    
    // Almacenar recomendaciones para la sección de recomendaciones
    if (aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0) {
      const normalizedCategory = category.replace(/-/g, "_").toUpperCase();
      if (!aiAnalysisResult.recommendations[normalizedCategory]) {
        aiAnalysisResult.recommendations[normalizedCategory] = [];
      }
      aiAnalysis.recommendations.forEach((rec) => {
        if (!aiAnalysisResult.recommendations[normalizedCategory].includes(rec)) {
          aiAnalysisResult.recommendations[normalizedCategory].push(rec);
        }
      });
    }
    
    const analysisHeight = analysisLines.length * 5;
    const circleHeight = radius * 2;
    currentY += Math.max(circleHeight, analysisHeight) + 15;
  } else {
    currentY += radius * 2 + 15;
  }
  
  return score;
};
  

  // Draw status icon (check or X)
  const drawStatusIcon = (x: number, isGood: boolean) => {
    const iconSize = 3
    if (isGood) {
      // Draw a check mark for good/pass status
      pdf.setDrawColor(colors.good)
      pdf.setLineWidth(0.8)
      pdf.line(x - iconSize / 2, currentY + 3, x - iconSize / 6, currentY + 4)
      pdf.line(x - iconSize / 6, currentY + 4, x + iconSize / 2, currentY + 1)
    } else {
      // Draw an X for poor/fail status
      pdf.setDrawColor(colors.poor)
      pdf.setLineWidth(0.8)
      pdf.line(x - iconSize / 2, currentY + 1, x + iconSize / 2, currentY + 4)
      pdf.line(x - iconSize / 2, currentY + 4, x + iconSize / 2, currentY + 1)
    }
  }

  // Draw metrics table
  const drawMetricsTable = (metrics: any[], deviceType: string) => {
    checkSpace(15)
    pdf.setFillColor(colors.sectionBg)
    pdf.rect(10, currentY, pageWidth - 20, 10, "F")
    pdf.setTextColor(colors.text)
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "bold")
    pdf.text(`${deviceType} Metrics`, 15, currentY + 7)
    pdf.text("Value", pageWidth - 70, currentY + 7)
    pdf.text("Status", pageWidth - 25, currentY + 7)
    currentY += 15

    if (metrics && metrics.length > 0) {
      metrics.forEach((metric, metricIndex) => {
        checkSpace(10)
        const metricNameMaxWidth = pageWidth - 90
        const metricName = metric.name
        const metricNameLines = pdf.splitTextToSize(metricName, metricNameMaxWidth)
        const lineHeight = 8
        const rowHeight = metricNameLines.length * lineHeight
        pdf.setFillColor(metricIndex % 2 === 0 ? colors.lightBg : colors.background)
        pdf.rect(10, currentY, pageWidth - 20, rowHeight, "F")
        pdf.setTextColor(colors.text)
        pdf.setFontSize(9)
        pdf.setFont("helvetica", "normal")
        pdf.text(metricNameLines, 15, currentY + 6)
        const metricValue = metric.value
        pdf.text(metricValue, pageWidth - 70, currentY + 6)

        // EXPLICIT CHECK FOR PASS/FAIL STATUS
        let isGood = true

        // First check if there's an explicit status
        if (metric.status) {
          // If status is explicitly "fail", show X
          if (metric.status.toLowerCase() === "fail") {
            isGood = false
          }
          // If status is explicitly "pass", show check
          else if (metric.status.toLowerCase() === "pass") {
            isGood = true
          }
        } else {
          // If no explicit status, use heuristics
          if (
            metricName.toLowerCase().includes("load") ||
            metricName.toLowerCase().includes("time") ||
            metricName.toLowerCase().includes("size") ||
            metricName.toLowerCase().includes("delay")
          ) {
            const numericValue = Number.parseFloat(metricValue.replace(/[^0-9.]/g, ""))
            // For time/load/size metrics, lower is better
            isGood = !isNaN(numericValue) && numericValue < 3
          }

          // Additional checks for common fail conditions
          if (
            metricValue.toLowerCase().includes("fail") ||
            metricValue.toLowerCase().includes("error") ||
            metricValue.toLowerCase().includes("high") ||
            metricValue.toLowerCase().includes("slow") ||
            metricValue.toLowerCase().includes("poor")
          ) {
            isGood = false
          }
        }

        // Draw appropriate icon based on isGood value
        drawStatusIcon(pageWidth - 25, isGood)
        currentY += rowHeight
      })
    }
  }

  // Draw issues table
  const drawIssuesTable = (issues: any[], deviceType: string) => {
    checkSpace(15)
    pdf.setFillColor(colors.sectionBg)
    pdf.rect(10, currentY, pageWidth - 20, 10, "F")
    pdf.setTextColor(colors.text)
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "bold")
    pdf.text(`${deviceType} Issues`, 15, currentY + 7)
    pdf.text("Status", pageWidth - 25, currentY + 7)
    currentY += 15

    if (issues && issues.length > 0) {
      issues.forEach((issue, issueIndex) => {
        checkSpace(10)
        const issueTitleMaxWidth = pageWidth - 50
        const issueTitle = issue.title
        const issueTitleLines = pdf.splitTextToSize(`• ${issueTitle}`, issueTitleMaxWidth)
        const rowHeight = issueTitleLines.length * 5
        pdf.setFillColor(issueIndex % 2 === 0 ? colors.lightBg : colors.background)
        pdf.rect(10, currentY, pageWidth - 20, rowHeight + 3, "F")
        pdf.setTextColor(colors.text)
        pdf.setFontSize(9)
        pdf.setFont("helvetica", "normal")
        pdf.text(issueTitleLines, 15, currentY + 6)

        // Issues are always displayed with X mark (false)
        drawStatusIcon(pageWidth - 25, false)
        currentY += rowHeight + 3

        if (issue.description) {
          checkSpace(10)
          pdf.setTextColor(colors.lightText)
          pdf.setFontSize(8)
          const descLines = pdf.splitTextToSize(issue.description, pageWidth - 50)
          pdf.text(descLines, 20, currentY + 4)
          currentY += descLines.length * 5 + 2
        }
      })
    } else {
      checkSpace(10)
      pdf.setTextColor(colors.text)
      pdf.setFontSize(9)
      pdf.text("No issues found", 15, currentY + 6)
      // No issues is good (true)
      drawStatusIcon(pageWidth - 25, true)
      currentY += 10
    }
  }

  // Draw conclusion page
  const drawConclusionPage = () => {
    // Background color
    pdf.setFillColor(colors.coverBg)
    pdf.rect(0, 0, pageWidth, pageHeight, "F")

    // Barra superior con degradado
    const ctx = pdf.context2d
    const gradient = ctx.createLinearGradient(0, 0, pageWidth, 0)
    gradient.addColorStop(0, colors.primary)
    gradient.addColorStop(1, colors.secondary)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, pageWidth, 40)

    // Título
    pdf.setFontSize(24)
    pdf.setTextColor(colors.primary)
    pdf.setFont("helvetica", "bold")
    pdf.text("CONCLUSION", pageWidth / 2, pageHeight / 2 - 20, { align: "center" })

    // Línea decorativa
    pdf.setDrawColor(colors.accent)
    pdf.setLineWidth(2)
    pdf.line(pageWidth / 2 - 40, pageHeight / 2 - 10, pageWidth / 2 + 40, pageHeight / 2 - 10)

    // Closing message
    pdf.setFontSize(14)
    const closingMessage = `
      Thank you for using our Website Analysis Report.
      This report provides actionable insights to help improve your website's performance,
      accessibility, best practices adherence, and SEO. 
      For further assistance or a detailed consultation, feel free to contact us.
    `
    const messageLines = pdf.splitTextToSize(closingMessage.trim(), pageWidth - 40)

    pdf.text(messageLines, pageWidth / 2, pageHeight / 2 + 10, { align: "center" })

    // Footer message
    pdf.setFillColor(colors.primary)
    pdf.rect(0, pageHeight - 25, pageWidth, 25, "F")

    pdf.setTextColor("#FFFFFF")
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "normal")
    pdf.text("CONFIDENTIAL", 15, pageHeight - 10)

    const contactInfo = pageAnalysis.companyInfo?.contactEmail || "contact@example.com"
    pdf.text(contactInfo, pageWidth - 15, pageHeight - 10, { align: "right" })
  }

  // Reemplazar la parte del código principal que genera el PDF
  // Start the PDF with cover page
  drawCoverPage()

  // Añadir una nueva página para el contenido real
  pdf.addPage()
  pageNumber = 2
  currentY = 25

  // Dibujar el encabezado en la segunda página (primera página de contenido)
  drawHeader()

  // Title
  pdf.setTextColor(colors.primary)
  pdf.setFontSize(18)
  pdf.setFont("helvetica", "bold")
  pdf.text("Website Performance Analysis", pageWidth / 2, currentY, { align: "center" })
  currentY += 15

  // URL
  pdf.setTextColor(colors.text)
  pdf.setFontSize(12)
  pdf.setFont("helvetica", "normal")
  pdf.text(`Analyzed URL: ${pageAnalysis.url}`, pageWidth / 2, currentY, { align: "center" })
  currentY += 15

  // Speed Section
  if (pageAnalysis.speed) {
    // Group data by category
    const categoryMap = new Map()

    if (pageAnalysis.speed.mobile) {
      pageAnalysis.speed.mobile.forEach((category) => {
        if (!categoryMap.has(category.category)) {
          categoryMap.set(category.category, { mobile: null, desktop: null })
        }
        categoryMap.get(category.category).mobile = category
      })
    }

    if (pageAnalysis.speed.desktop) {
      pageAnalysis.speed.desktop.forEach((category) => {
        if (!categoryMap.has(category.category)) {
          categoryMap.set(category.category, { mobile: null, desktop: null })
        }
        categoryMap.get(category.category).desktop = category
      })
    }

    // Display each category with both mobile and desktop
    Array.from(categoryMap.entries()).forEach(([category, data]) => {
      checkSpace(20)
      drawSectionHeader(category)

      let mobileScore = 0
      let desktopScore = 0

      // Mobile data for this category
      if (data.mobile) {
        mobileScore = drawCircleProgress(data.mobile.score / 100, `Mobile - ${category}`)
        drawMetricsTable(data.mobile.metrics, "Mobile")
        drawIssuesTable(data.mobile.issues, "Mobile")
      }

      // Desktop data for this category
      if (data.desktop) {
        desktopScore = drawCircleProgress(data.desktop.score / 100, `Desktop - ${category}`)
        drawMetricsTable(data.desktop.metrics, "Desktop")
        drawIssuesTable(data.desktop.issues, "Desktop")
      }

      // Add comparison chart if we have both mobile and desktop data
      if (data.mobile && data.desktop) {
        drawDeviceComparisonChart(data.mobile.score / 100, data.desktop.score / 100, category)
      }

    //  drawSectionHeader("Recomendaciones")
      // Add recommendations based on average score
      const avgScore = (mobileScore + desktopScore) / (mobileScore > 0 && desktopScore > 0 ? 2 : 1)
      drawRecommendations(category, avgScore)

      currentY += 10 // Add extra spacing between categories
    });
  }


  // SEO Analysis Section
  if (pageAnalysis.seo) {
    checkSpace(20)
   // drawSectionHeader("SEO Analysis")
    const seoScore = pageAnalysis.seo.page_metrics.onpage_score
    // For on-page score, ensure we only show 2 digits when multiplied by 100
    const formattedSeoScore = Math.round(seoScore * 100)
    const displayScore = formattedSeoScore >= 1000 ? formattedSeoScore.toString().substring(0, 2) : formattedSeoScore
    drawCircleProgress(seoScore, `On-page Score: ${displayScore}`)

    checkSpace(15)
    pdf.setFillColor(colors.sectionBg)
    pdf.rect(10, currentY, pageWidth - 20, 10, "F")
    pdf.setTextColor(colors.text)
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "bold")
    pdf.text("Domain Information", 15, currentY + 7)
    pdf.text("Status", pageWidth - 25, currentY + 7)
    currentY += 15

    const domain = pageAnalysis.seo.domain_info
    const domainInfo = [
      { label: "CMS", value: domain.cms || "Not detected", isGood: !!domain.cms },
      { label: "Server", value: domain.server, isGood: !!domain.server },
      { label: "IP", value: domain.ip, isGood: !!domain.ip },
      {
        label: "Total Pages",
        value: domain.total_pages.toString(),
        isGood: domain.total_pages > 0,
      },
      {
        label: "SSL Valid",
        value: domain.ssl_info.valid_certificate ? "Yes" : "No",
        isGood: domain.ssl_info.valid_certificate,
      },
      {
        label: "Certificate Issuer",
        value: domain.ssl_info.certificate_issuer,
        isGood: !!domain.ssl_info.certificate_issuer,
      },
      { label: "Expiration", value: domain.ssl_info.certificate_expiration_date, isGood: true },
    ]

    domainInfo.forEach((item, index) => {
      checkSpace(10)
      const labelMaxWidth = pageWidth - 80
      const labelLines = pdf.splitTextToSize(item.label, labelMaxWidth)
      const lineHeight = 8
      const rowHeight = labelLines.length * lineHeight
      pdf.setFillColor(index % 2 === 0 ? colors.lightBg : colors.background)
      pdf.rect(10, currentY, pageWidth - 20, rowHeight, "F")
      pdf.setTextColor(colors.text)
      pdf.setFontSize(9)
      pdf.setFont("helvetica", "normal")
      pdf.text(labelLines, 15, currentY + 6)
      const valueMaxWidth = 60
      const valueLines = pdf.splitTextToSize(item.value, valueMaxWidth)
      pdf.text(valueLines, pageWidth - 80, currentY + 6)

      // Draw the correct icon based on isGood value
      drawStatusIcon(pageWidth - 25, item.isGood)
      currentY += rowHeight
    })

    checkSpace(15)
    pdf.setFillColor(colors.sectionBg)
    pdf.rect(10, currentY, pageWidth - 20, 10, "F")
    pdf.setTextColor(colors.text)
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "bold")
    pdf.text("SEO Checks", 15, currentY + 7)
    pdf.text("Status", pageWidth - 25, currentY + 7)
    currentY += 15

    const checks = pageAnalysis.seo.domain_info.checks
    const checkList = [
      { label: "Sitemap", value: checks.sitemap ? "Yes" : "No", isGood: checks.sitemap },
      { label: "robots.txt", value: checks.robots_txt ? "Yes" : "No", isGood: checks.robots_txt },
      {
        label: "HTTPS Redirect",
        value: checks.test_https_redirect ? "Yes" : "No",
        isGood: checks.test_https_redirect,
      },
      {
        label: "Canonicalization",
        value: checks.test_canonicalization ? "Yes" : "No",
        isGood: checks.test_canonicalization,
      },
      { label: "HTTP/2", value: checks.http2 ? "Yes" : "No", isGood: checks.http2 },
    ]

    checkList.forEach((item, index) => {
      checkSpace(10)
      pdf.setFillColor(index % 2 === 0 ? colors.lightBg : colors.background)
      pdf.rect(10, currentY, pageWidth - 20, 8, "F")
      pdf.setTextColor(colors.text)
      pdf.setFontSize(9)
      pdf.setFont("helvetica", "normal")
      pdf.text(item.label, 15, currentY + 6)
      pdf.setTextColor(item.isGood ? colors.good : colors.poor)
      pdf.text(item.value, pageWidth - 50, currentY + 6)
      pdf.setTextColor(colors.text)

      // Draw the correct icon based on isGood value
      drawStatusIcon(pageWidth - 25, item.isGood)
      currentY += 8
    })

    checkSpace(15)
    pdf.setFillColor(colors.sectionBg)
    pdf.rect(10, currentY, pageWidth - 20, 10, "F")
    pdf.setTextColor(colors.text)
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "bold")
    pdf.text("Page Metrics", 15, currentY + 7)
    pdf.text("Status", pageWidth - 25, currentY + 7)
    currentY += 15

    const metrics = pageAnalysis.seo.page_metrics
    const pageMetrics = [
      {
        label: "External Links",
        value: metrics.links_external.toString(),
        isGood: metrics.links_external > 0,
      },
      {
        label: "Internal Links",
        value: metrics.links_internal.toString(),
        isGood: metrics.links_internal > 0,
      },
      {
        label: "Duplicate Titles",
        value: metrics.duplicate_title.toString(),
        isGood: metrics.duplicate_title === 0,
      },
      {
        label: "Duplicate Descriptions",
        value: metrics.duplicate_description.toString(),
        isGood: metrics.duplicate_description === 0,
      },
      {
        label: "Broken Links",
        value: metrics.broken_links.toString(),
        isGood: metrics.broken_links === 0,
      },
      {
        label: "Non-indexable Pages",
        value: metrics.non_indexable.toString(),
        isGood: metrics.non_indexable === 0,
      },
    ]

    pageMetrics.forEach((item, index) => {
      checkSpace(10)
      const labelMaxWidth = pageWidth - 80
      const labelLines = pdf.splitTextToSize(item.label, labelMaxWidth)
      const lineHeight = 8
      const rowHeight = labelLines.length * lineHeight
      pdf.setFillColor(index % 2 === 0 ? colors.lightBg : colors.background)
      pdf.rect(10, currentY, pageWidth - 20, rowHeight, "F")
      pdf.setTextColor(colors.text)
      pdf.setFontSize(9)
      pdf.setFont("helvetica", "normal")
      pdf.text(labelLines, 15, currentY + 6)

      // Set text color based on the metric
      const value = Number.parseInt(item.value)
      if (["Duplicate Titles", "Duplicate Descriptions", "Broken Links", "Non-indexable Pages"].includes(item.label)) {
        pdf.setTextColor(value > 0 ? colors.poor : colors.good)
      } else if (["External Links", "Internal Links"].includes(item.label)) {
        pdf.setTextColor(value > 0 ? colors.good : colors.poor)
      }

      pdf.text(item.value, pageWidth - 50, currentY + 6)
      pdf.setTextColor(colors.text)

      // Draw the correct icon based on isGood value
      drawStatusIcon(pageWidth - 25, item.isGood)
      currentY += rowHeight
    })

    // Añadir recomendaciones para SEO
    drawRecommendations("seo", seoScore)
  }

  // Add conclusion page
  pdf.addPage()
  pageNumber++
  drawConclusionPage()

  // Update total pages count
  totalPages = pageNumber

  // Add footers to all pages EXCEPT the cover page (page 1)
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    drawFooter(i, totalPages)
  }

  // Save PDF
  pdf.save("website-performance-report.pdf")
}
