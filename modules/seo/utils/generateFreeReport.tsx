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

  // Get improvement recommendations based on category and score
  const getRecommendations = (category: string, score: number): string[] => {
    const recommendations: string[] = []

    // General recommendations based on score
    if (score < 0.5) {
      recommendations.push(
        "Immediate action is required to improve this area as it significantly impacts your website performance.",
      )
    } else if (score < 0.9) {
      recommendations.push(
        "There's room for improvement in this area which could help enhance your website performance.",
      )
    }

    // Category-specific recommendations
    switch (category.toLowerCase()) {
      case "performance":
        if (score < 0.7) {
          recommendations.push("Consider optimizing images and implementing lazy loading for better page load times.")
          recommendations.push("Minimize and combine CSS/JavaScript files to reduce HTTP requests.")
          recommendations.push(
            "Implement browser caching for static resources to improve load times for returning visitors.",
          )
        }
        break
      case "accessibility":
        if (score < 0.8) {
          recommendations.push("Ensure all images have appropriate alt text for screen readers.")
          recommendations.push("Improve color contrast for better readability.")
          recommendations.push("Add proper ARIA labels to interactive elements.")
        }
        break
      case "best practices":
        if (score < 0.8) {
          recommendations.push("Update any deprecated HTML, CSS, or JavaScript features.")
          recommendations.push("Ensure secure connections with HTTPS implementation.")
          recommendations.push("Fix any JavaScript errors that occur during page load.")
        }
        break
      case "seo":
        if (score < 0.8) {
          recommendations.push("Optimize meta titles and descriptions for better click-through rates.")
          recommendations.push("Ensure content is properly structured with appropriate heading tags (H1, H2, etc.).")
          recommendations.push("Improve mobile responsiveness as it affects SEO rankings.")
          recommendations.push("Create a comprehensive XML sitemap and submit it to search engines.")
        }
        break
      default:
        recommendations.push(
          "Review the specific issues identified in this section and address them according to best practices.",
        )
    }

    return recommendations
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

  // Función para dibujar el análisis de IA - Corregida para manejar correctamente las claves
  const drawAIAnalysis = (category: string, deviceType: string) => {
    // Normalizar la categoría para que coincida con las claves en aiAnalysisResult
    // Importante: Usar el mismo formato que en el servicio IA.service.ts
    const normalizedCategory = category.replace(/-/g, "_").toUpperCase()
    const sectionKey = `${deviceType.toUpperCase()}_${normalizedCategory}`

    console.log(`Buscando análisis IA para: ${sectionKey}`)
    console.log(`Secciones disponibles:`, Object.keys(aiAnalysisResult.sections))

    // Verificar si existe el análisis para esta sección
    if (!aiAnalysisResult.sections || !aiAnalysisResult.sections[sectionKey]) {
      console.log(`No AI analysis found for: ${sectionKey}`)

      // Intentar buscar con otras variaciones de la clave
      const alternativeKeys = Object.keys(aiAnalysisResult.sections).filter(
        (key) => key.includes(deviceType.toUpperCase()) && key.includes(category.toUpperCase().replace(/-/g, "_")),
      )

      if (alternativeKeys.length > 0) {
        console.log(`Encontradas claves alternativas: ${alternativeKeys.join(", ")}`)
        const alternativeKey = alternativeKeys[0]
        console.log(`Usando clave alternativa: ${alternativeKey}`)
        const analysisData = aiAnalysisResult.sections[alternativeKey]
        drawAIAnalysisContent(analysisData, category, deviceType)
      } else {
        console.log(`No se encontraron claves alternativas para ${category} ${deviceType}`)
      }
      return
    }

    const analysisData = aiAnalysisResult.sections[sectionKey]
    console.log(`Drawing AI analysis for ${sectionKey}:`, analysisData)
    drawAIAnalysisContent(analysisData, category, deviceType)
  }

  // Función auxiliar para dibujar el contenido del análisis de IA
  const drawAIAnalysisContent = (
    analysisData: { analysis: string; recommendations: string[] },
    category: string,
    deviceType: string,
  ) => {
    checkSpace(40)

    // Encabezado de la sección de análisis IA
    pdf.setFillColor(colors.secondary)
    pdf.rect(15, currentY, pageWidth - 30, 8, "F")
    pdf.setTextColor("#FFFFFF")
    pdf.setFontSize(11)
    pdf.setFont("helvetica", "bold")
    pdf.text(`Análisis IA - ${deviceType} ${category}`, 20, currentY + 6)
    currentY += 12

    // Dibujar el análisis
    pdf.setTextColor(colors.text)
    pdf.setFontSize(9)
    pdf.setFont("helvetica", "normal")
    const analysisLines = pdf.splitTextToSize(analysisData.analysis, pageWidth - 40)
    pdf.text(analysisLines, 20, currentY + 4)
    currentY += analysisLines.length * 5 + 8

    // Ya no mostramos recomendaciones aquí, ya que ahora se mostrarán en la sección general de recomendaciones
    currentY += 10 // Espacio adicional después de la sección
  }

  // Implementar la nueva función drawCoverPage() con el diseño profesional
  const drawCoverPage = () => {
    // Asegurarnos de que estamos en la primera página
    pdf.setPage(1)

    // Limpiar completamente la página (fondo blanco)
    pdf.setFillColor("#FFFFFF")
    pdf.rect(0, 0, pageWidth, pageHeight, "F")

    // Company logo
    try {
      const logoWidth = 60
      const logoHeight = 60
      const logoX = pageWidth / 2 - logoWidth / 2
      const logoY = 35

      // Use the uploaded logo if available
      if (pageAnalysis.companyInfo?.logo) {
        pdf.addImage(pageAnalysis.companyInfo.logo, "PNG", logoX, logoY, logoWidth, logoHeight)
      } else {
        // Fallback to default logo
        pdf.addImage(
          "https://pplx-res.cloudinary.com/image/upload/v1743881513/user_uploads/kxfXyhGFItaKuNC/logo.jpg",
          "PNG",
          logoX,
          logoY,
          logoWidth,
          logoHeight,
        )
      }
    } catch (error) {
      console.error("Error loading logo:", error)

      // Backup arrows if logo fails to load
      pdf.setFillColor("#1E88E5")

      // Small arrow
      pdf.setLineWidth(0.1)
      const arrow1X = pageWidth / 2 - 15
      const arrow1Y = 60
      pdf.triangle(arrow1X, arrow1Y, arrow1X - 10, arrow1Y + 15, arrow1X + 10, arrow1Y + 15, "F")
      pdf.rect(arrow1X - 5, arrow1Y + 15, 10, 15, "F")

      // Large arrow
      const arrow2X = pageWidth / 2 + 15
      const arrow2Y = 50
      pdf.triangle(arrow2X, arrow2Y, arrow2X - 15, arrow2Y + 20, arrow2X + 15, arrow2Y + 20, "F")
      pdf.rect(arrow2X - 7, arrow2Y + 20, 14, 20, "F")
    }

    // Company name - use the provided name or default
    const companyName = pageAnalysis.companyInfo?.name || "Tamer Digital"
    pdf.setFontSize(24)
    pdf.setTextColor("#333333")
    pdf.setFont("helvetica", "bold")
    pdf.text(companyName, pageWidth / 2, 110, { align: "center" })

    // Slogan
    pdf.setFontSize(12)
    pdf.setTextColor("#666666")
    pdf.setFont("helvetica", "italic")
    pdf.text("Web Optimization and SEO Specialists", pageWidth / 2, 122, { align: "center" })

    // Decorative line
    pdf.setDrawColor("#3498DB")
    pdf.setLineWidth(1)
    pdf.line(pageWidth / 2 - 60, 132, pageWidth / 2 + 60, 132)

    // SEO decorative icons
    const drawSeoIcon = (x: number, y: number, size: number) => {
      pdf.setDrawColor("#3498DB")
      pdf.setLineWidth(0.7)
      pdf.setFillColor("#F5F9FD")

      // Simple bar chart
      pdf.rect(x, y, size / 4, size / 2, "FD")
      pdf.rect(x + size / 3, y - size / 4, size / 4, (size * 3) / 4, "FD")
      pdf.rect(x + (size * 2) / 3, y - size / 2, size / 4, size, "FD")

      // Trend line
      pdf.setDrawColor("#0CCE6B")
      pdf.setLineWidth(1)
      pdf.line(x - size / 10, y + size / 3, x + size / 4, y)
      pdf.line(x + size / 4, y, x + size / 2, y + size / 6)
      pdf.line(x + size / 2, y + size / 6, x + (size * 3) / 4, y - size / 4)
      pdf.line(x + (size * 3) / 4, y - size / 4, x + size + size / 10, y - size / 2)
    }

    // Draw decorative icons
    drawSeoIcon(pageWidth / 4, 155, 20)
    drawSeoIcon((pageWidth * 3) / 4, 155, 20)

    // Report title
    pdf.setFillColor("#0D47A1")
    pdf.roundedRect(pageWidth / 2 - 100, 175, 200, 40, 3, 3, "F")

    pdf.setFontSize(22)
    pdf.setTextColor("#FFFFFF")
    pdf.setFont("helvetica", "bold")
    pdf.text("WEB ANALYSIS", pageWidth / 2, 195, { align: "center" })

    pdf.setFontSize(14)
    pdf.text("Performance Report", pageWidth / 2, 207, { align: "center" })

    // Analyzed URL with decorative frame
    pdf.setFillColor("#F5F9FD")
    pdf.setDrawColor("#3498DB")
    pdf.setLineWidth(0.5)
    pdf.roundedRect(pageWidth / 2 - 90, 225, 180, 30, 2, 2, "FD")

    pdf.setFontSize(10)
    pdf.setTextColor("#0D47A1")
    pdf.setFont("helvetica", "normal")
    pdf.text("ANALYZED URL:", pageWidth / 2, 235, { align: "center" })

    pdf.setFontSize(11)
    pdf.setTextColor("#333333")
    pdf.setFont("helvetica", "bold")
    const urlLines = pdf.splitTextToSize(pageAnalysis.url, 160)
    pdf.text(urlLines, pageWidth / 2, 245, { align: "center" })

    // Generation date
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    pdf.setFontSize(10)
    pdf.setTextColor("#666666")
    pdf.setFont("helvetica", "italic")
    pdf.text(`Generated on: ${date}`, pageWidth / 2, 265, { align: "center" })

    // Contact information box - use provided contact info or default
    pdf.setFillColor("#F5F9FD")
    pdf.setDrawColor("#E0E0E0")
    pdf.setLineWidth(0.5)
    pdf.roundedRect(pageWidth / 2 - 75, pageHeight - 80, 150, 50, 3, 3, "FD")

    pdf.setFontSize(9)
    pdf.setTextColor("#333333")
    pdf.setFont("helvetica", "normal")
    pdf.text("CONTACT", pageWidth / 2, pageHeight - 70, { align: "center" })
    pdf.setTextColor("#555555")

    const email = pageAnalysis.companyInfo?.contactEmail || "contact@tamerdigital.com"
    const phone = pageAnalysis.companyInfo?.contactPhone || "+1 234 567 890"
    const website = pageAnalysis.companyInfo?.website || "www.tamerdigital.com"

    pdf.text(`Email: ${email}`, pageWidth / 2, pageHeight - 60, { align: "center" })
    pdf.text(`Phone: ${phone}`, pageWidth / 2, pageHeight - 50, { align: "center" })
    pdf.text(`Web: ${website}`, pageWidth / 2, pageHeight - 40, { align: "center" })

    // Confidentiality notice
    pdf.setFillColor("#EFEFEF")
    pdf.rect(0, pageHeight - 20, pageWidth, 20, "F")

    pdf.setFontSize(8)
    pdf.setTextColor("#777777")
    pdf.text(
      "CONFIDENTIAL - This document contains proprietary and confidential information.",
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" },
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

  // Draw recommendations section
  const drawRecommendations = (category: string, score: number) => {
    checkSpace(15)
    pdf.setFillColor(colors.good)
    pdf.rect(15, currentY, pageWidth - 30, 8, "F")
    pdf.setTextColor("#FFFFFF")
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "bold")
    pdf.text("Recommendations for Improvement", 20, currentY + 6)
    currentY += 12

    // Normalizar la categoría igual que en el resto del código
    const normalizedCategory = category.replace(/-/g, "_").toUpperCase()

    // Verificar si tenemos recomendaciones de la IA para esta categoría
    let recommendations: string[] = []

    if (aiAnalysisResult.recommendations && aiAnalysisResult.recommendations[normalizedCategory]) {
      console.log(`Usando recomendaciones IA para categoría: ${normalizedCategory}`)
      recommendations = aiAnalysisResult.recommendations[normalizedCategory]
    } else {
      console.log(`No se encontraron recomendaciones IA para: ${normalizedCategory}`)
      console.log(`Categorías disponibles:`, Object.keys(aiAnalysisResult.recommendations || {}))

      // Intentar buscar con variaciones de la clave
      const alternativeKeys = Object.keys(aiAnalysisResult.recommendations || {}).filter(
        (key) => key.includes(normalizedCategory) || normalizedCategory.includes(key),
      )

      if (alternativeKeys.length > 0) {
        console.log(`Encontradas claves alternativas para recomendaciones: ${alternativeKeys.join(", ")}`)
        const alternativeKey = alternativeKeys[0]
        console.log(`Usando clave alternativa para recomendaciones: ${alternativeKey}`)
        recommendations = aiAnalysisResult.recommendations[alternativeKey]
      } else {
        // Si no hay recomendaciones de IA, usar las predeterminadas
        console.log(`Usando recomendaciones predeterminadas para: ${category}`)
        recommendations = getRecommendations(category, score)
      }
    }

    pdf.setTextColor(colors.text)
    pdf.setFontSize(9)
    pdf.setFont("helvetica", "normal")

    if (recommendations.length === 0) {
      const noRecommendationText = "No specific recommendations available for this category."
      pdf.text(noRecommendationText, 20, currentY + 4)
      currentY += 10
    } else {
      recommendations.forEach((recommendation, index) => {
        checkSpace(10)
        const bulletPoint = `${index + 1}. `
        const textWidth = pageWidth - 50
        const recommendationLines = pdf.splitTextToSize(recommendation, textWidth - pdf.getTextWidth(bulletPoint))

        pdf.text(bulletPoint, 20, currentY + 4)
        pdf.text(recommendationLines, 20 + pdf.getTextWidth(bulletPoint), currentY + 4)

        currentY += recommendationLines.length * 5 + 3
      })
    }

    currentY += 5 // Add extra space after recommendations
  }

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

  // Replace the existing drawCircleProgress function with the new styled version
  // Draw circle progress indicators (with gradient style like the purple example)
  const drawCircleProgress = (score: number, label: string, x = 30, radius = 15) => {
    checkSpace(radius * 2 + 15) // Increased space check

    // Calculate score percentage
    const scorePercentage = Math.round(score * 100)

    // Add label text ABOVE the circle with more spacing
    pdf.setTextColor(colors.text)
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "bold")
    pdf.text(label, 15, currentY + 6)

    // Move currentY down more to create additional space between text and circle
    currentY += 15 // Increased from 10 to 15

    // Get context for advanced drawing
    const ctx = pdf.context2d

    // Create gradient colors based on score
    let gradientStart, gradientEnd

    if (score >= 0.9) {
      // Good score (green to teal)
      gradientStart = "#10b981" // Emerald
      gradientEnd = "#14b8a6" // Teal
    } else if (score >= 0.5) {
      // Average score (amber to orange)
      gradientStart = "#f59e0b" // Amber
      gradientEnd = "#f97316" // Orange
    } else {
      // Poor score (rose to red)
      gradientStart = "#e11d48" // Rose
      gradientEnd = "#dc2626" // Red
    }

    // Draw full circle background (gray)
    ctx.beginPath()
    ctx.arc(x, currentY + radius, radius, 0, Math.PI * 2, false)
    ctx.fillStyle = "#f1f5f9"
    ctx.fill()

    // Create gradient for the progress arc
    const grd = ctx.createLinearGradient(x - radius, currentY + radius, x + radius, currentY + radius)
    grd.addColorStop(0, gradientStart)
    grd.addColorStop(1, gradientEnd)

    // Draw progress arc
    const startAngle = -Math.PI / 2 // Start from top
    const endAngle = startAngle + score * Math.PI * 2

    // Draw filled arc
    ctx.beginPath()
    ctx.moveTo(x, currentY + radius)
    ctx.arc(x, currentY + radius, radius, startAngle, endAngle, false)
    ctx.lineTo(x, currentY + radius)
    ctx.fillStyle = grd
    ctx.fill()

    // Draw inner white circle to create donut effect
    ctx.beginPath()
    ctx.arc(x, currentY + radius, radius * 0.65, 0, Math.PI * 2, false)
    ctx.fillStyle = "#ffffff"
    ctx.fill()

    // Add outer decorative circle
    ctx.beginPath()
    ctx.arc(x, currentY + radius, radius + 5, startAngle, endAngle, false)
    ctx.strokeStyle = grd
    ctx.lineWidth = 1
    ctx.stroke()

    // Format the score to show only 2 digits if it's a 4-digit number
    let scoreText = `${scorePercentage}`
    if (scoreText.length > 3) {
      scoreText = scoreText.substring(0, 2)
    }
    scoreText += "%"

    // Add percentage text in the center
    pdf.setTextColor(gradientStart)
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "bold")
    const textWidth = pdf.getTextWidth(scoreText)
    pdf.text(scoreText, x - textWidth / 2, currentY + radius + 3)

    // Add description text to the right of the circle
    pdf.setTextColor(colors.lightText)
    pdf.setFontSize(9)
    pdf.setFont("helvetica", "normal")
    let description = ""
    if (label.includes("Mobile ")) {
      description =
        "This metric represents the overall performance of the page on mobile devices. " +
        "A higher score indicates a better experience for mobile users, considering loading speed, " +
        "interactivity, and visual stability."
    } else if (label.includes("Desktop ")) {
      description =
        "This metric shows the overall performance of the page on desktop computers. " +
        "A higher score reflects a better experience for desktop users, evaluating loading time, " +
        "interactivity, and visual stability."
    } else if (label.includes("On-page Score")) {
      description =
        "This score reflects the overall on-page SEO optimization. " +
        "It considers factors such as meta tags, content structure, internal and external links, " +
        "and other SEO best practices."
    }

    // Calculate the available width for the description (right of the circle)
    const descriptionX = x + radius * 2 + 10 // Position to the right of the circle
    const descriptionWidth = pageWidth - descriptionX - 15 // Width available for description
    const descriptionLines = pdf.splitTextToSize(description, descriptionWidth)

    // Position the description text to the right of the circle
    pdf.text(descriptionLines, descriptionX, currentY + 5)

    // Calculate the height needed for the description or the circle, whichever is taller
    const descriptionHeight = descriptionLines.length * 5
    const circleHeight = radius * 2

    // Move down after the taller of the two elements
    currentY += Math.max(circleHeight, descriptionHeight) + 15 // Increased from 10 to 15 for more spacing

    return scorePercentage / 100 // Return the score for recommendations
  }

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
        // Añadir análisis de IA para móvil
        drawAIAnalysis(category, "mobile")
      }

      // Desktop data for this category
      if (data.desktop) {
        desktopScore = drawCircleProgress(data.desktop.score / 100, `Desktop - ${category}`)
        drawMetricsTable(data.desktop.metrics, "Desktop")
        drawIssuesTable(data.desktop.issues, "Desktop")
        // Añadir análisis de IA para desktop
        drawAIAnalysis(category, "desktop")
      }

      // Add comparison chart if we have both mobile and desktop data
      if (data.mobile && data.desktop) {
        drawDeviceComparisonChart(data.mobile.score / 100, data.desktop.score / 100, category)
      }

      // Add recommendations based on average score
      const avgScore = (mobileScore + desktopScore) / (mobileScore > 0 && desktopScore > 0 ? 2 : 1)
      drawRecommendations(category, avgScore)

      currentY += 10 // Add extra spacing between categories
    })
  }

  // SEO Analysis Section
  if (pageAnalysis.seo) {
    checkSpace(20)
    drawSectionHeader("SEO Analysis")
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

    // Añadir análisis de IA para SEO
    // drawAIAnalysis('seo', 'desktop');
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
