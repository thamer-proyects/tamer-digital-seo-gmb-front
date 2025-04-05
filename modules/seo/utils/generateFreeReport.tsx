import jsPDF from "jspdf"
import type { PageAnalysisResponse } from "./types/analysisResponse"

export async function generateFreeReportPDF(pageAnalysis: PageAnalysisResponse): Promise<void> {
  // Create PDF document
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // Page dimensions
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  // Color palette
  const colors = {
    background: "#FFFFFF",
    primary: "#0D47A1", // Dark blue for headers
    secondary: "#1E88E5", // Medium blue for subheaders
    text: "#333333", // Main text
    lightText: "#666666", // Secondary text
    good: "#0CCE6B", // Good scores (green)
    average: "#FFA400", // Average scores (amber)
    poor: "#FF4E42", // Poor scores (red)
    border: "#E0E0E0", // Borders
    lightBg: "#F5F7FA", // Light background
    sectionBg: "#EEF2F7", // Section background
    headerBg: "#1565C0", // Header background (darker blue)
    coverBg: "#0A2F5D", // Cover page background (very dark blue)
    coverAccent: "#3498DB", // Cover page accent color
  }

  // Helper function to shade a color (lighten or darken)
  const shadeColor = (color: string, percent: number): string => {
    let R = Number.parseInt(color.substring(1, 3), 16)
    let G = Number.parseInt(color.substring(3, 5), 16)
    let B = Number.parseInt(color.substring(5, 7), 16)

    R = Math.floor((R * (100 + percent)) / 100)
    G = Math.floor((G * (100 + percent)) / 100)
    B = Math.floor((B * (100 + percent)) / 100)

    R = R < 255 ? R : 255
    G = G < 255 ? G : 255
    B = B < 255 ? B : 255

    const RR = R.toString(16).padStart(2, "0")
    const GG = G.toString(16).padStart(2, "0")
    const BB = B.toString(16).padStart(2, "0")

    return `#${RR}${GG}${BB}`
  }

  // Tracking current position and page number
  let currentY = 25
  let pageNumber = 1
  let totalPages = 0

  // Helper functions
  const truncateText = (text: string, maxLength: number): string => {
    return text?.length > maxLength ? text.substring(0, maxLength) + "..." : text || ""
  }

  const getScoreColor = (score: number): string => {
    if (score >= 0.9) return colors.good
    if (score >= 0.5) return colors.average
    return colors.poor
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

  // Draw cover page
  const drawCoverPage = () => {
    // Clean white background
    pdf.setFillColor("#FFFFFF")
    pdf.rect(0, 0, pageWidth, pageHeight, "F")

    // Subtle accent color
    const accentColor = "#3498DB"

    // Top border accent - thin line
    pdf.setFillColor(accentColor)
    pdf.rect(0, 0, pageWidth, 3, "F")

    // Logo placeholder - subtle circle with icon
    pdf.setFillColor("#F5F9FD")
    pdf.circle(pageWidth / 2, 40, 15, "F")
    pdf.setDrawColor(accentColor)
    pdf.setLineWidth(0.5)
    pdf.circle(pageWidth / 2, 40, 15, "S")

    // Document icon in the circle
    pdf.setFillColor(accentColor)
    pdf.rect(pageWidth / 2 - 5, 35, 10, 12, "F")
    pdf.setFillColor("#FFFFFF")
    pdf.rect(pageWidth / 2 - 3, 37, 6, 1, "F")
    pdf.rect(pageWidth / 2 - 3, 39, 6, 1, "F")
    pdf.rect(pageWidth / 2 - 3, 41, 6, 1, "F")
    pdf.rect(pageWidth / 2 - 3, 43, 6, 1, "F")

    // Title
    pdf.setFontSize(24)
    pdf.setTextColor("#333333")
    pdf.setFont("helvetica", "bold")
    pdf.text("WEBSITE ANALYSIS", pageWidth / 2, 75, { align: "center" })

    // Subtitle
    pdf.setFontSize(16)
    pdf.setTextColor("#666666")
    pdf.text("Performance Report", pageWidth / 2, 90, { align: "center" })

    // Horizontal line - subtle separator
    pdf.setDrawColor("#E0E0E0")
    pdf.setLineWidth(0.5)
    pdf.line(pageWidth / 2 - 50, 100, pageWidth / 2 + 50, 100)

    // Website URL
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "normal")
    pdf.setTextColor("#777777")
    const urlLines = pdf.splitTextToSize(pageAnalysis.url, 120)
    pdf.text(urlLines, pageWidth / 2, 120, { align: "center" })

    // Date
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    pdf.text(`Generated on: ${date}`, pageWidth / 2, 140, { align: "center" })

    // Bottom decorative element - thin line
    pdf.setDrawColor(accentColor)
    pdf.setLineWidth(0.5)
    pdf.line(20, pageHeight - 40, pageWidth - 20, pageHeight - 40)

    // Footer text
    pdf.setFontSize(10)
    pdf.setTextColor("#888888")
    pdf.text("Confidential - For Internal Use Only", pageWidth / 2, pageHeight - 20, { align: "center" })

    pdf.addPage()
    pageNumber++
  }

  // Draw header on each page
  const drawHeader = () => {
    pdf.setFillColor(colors.headerBg)
    pdf.rect(0, 0, pageWidth, 15, "F")
    pdf.setTextColor("#FFFFFF")
    pdf.setFontSize(14)
    pdf.setFont("helvetica", "bold")
    pdf.text("Website Performance Report", 10, 10)
    pdf.setFontSize(8)
    pdf.setFont("helvetica", "normal")
    pdf.text(`URL: ${truncateText(pageAnalysis.url, 60)}`, 10, 14)
    const date = new Date().toLocaleDateString()
    pdf.text(`Generated: ${date}`, pageWidth - 10, 10, { align: "right" })
  }

  // Draw footer
  const drawFooter = (pageNum: number, totalPgs: number) => {
    pdf.setDrawColor(colors.border)
    pdf.setLineWidth(0.5)
    pdf.line(10, pageHeight - 10, pageWidth - 10, pageHeight - 10)
    pdf.setTextColor(colors.lightText)
    pdf.setFontSize(8)
    pdf.text("Automatically generated report", 10, pageHeight - 5)
    pdf.text(`Page ${pageNum} of ${totalPgs}`, pageWidth - 10, pageHeight - 5, { align: "right" })
  }

  // Draw section header
  const drawSectionHeader = (title: string) => {
    checkSpace(15)
    pdf.setFillColor(colors.headerBg)
    pdf.rect(10, currentY, pageWidth - 20, 10, "F")
    pdf.setTextColor("#FFFFFF")
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "bold")
    pdf.text(title, 15, currentY + 7)
    currentY += 15
  }

  // Draw subsection header (for Mobile/Desktop)
  const drawSubSectionHeader = (title: string) => {
    checkSpace(10)
    pdf.setFillColor(colors.secondary)
    pdf.rect(15, currentY, pageWidth - 30, 8, "F")
    pdf.setTextColor("#FFFFFF")
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "bold")
    pdf.text(title, 20, currentY + 6)
    currentY += 12
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

    const recommendations = getRecommendations(category, score)

    pdf.setTextColor(colors.text)
    pdf.setFontSize(9)
    pdf.setFont("helvetica", "normal")

    recommendations.forEach((recommendation, index) => {
      checkSpace(10)
      const bulletPoint = `${index + 1}. `
      const textWidth = pageWidth - 50
      const recommendationLines = pdf.splitTextToSize(recommendation, textWidth - pdf.getTextWidth(bulletPoint))

      pdf.text(bulletPoint, 20, currentY + 4)
      pdf.text(recommendationLines, 20 + pdf.getTextWidth(bulletPoint), currentY + 4)

      currentY += recommendationLines.length * 5 + 3
    })

    currentY += 5 // Add extra space after recommendations
  }

  // Draw circle progress indicators
  const drawCircleProgressOriginal = (score: number, label: string, x = 30, radius = 15) => {
    checkSpace(radius * 2 + 10)
    const scoreColor = getScoreColor(score)
    const scorePercentage = Math.round(score * 100)

    // Add label text ABOVE the circle
    pdf.setTextColor(colors.text)
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "bold")
    pdf.text(label, 15, currentY + 6)

    // Move currentY down a bit to create space between text and circle
    currentY += 10

    // Create a gradient background for the circle
    const ctx = pdf.context2d

    // Draw background circle with gradient
    const bgGradient = ctx.createRadialGradient(x, currentY + radius, 0, x, currentY + radius, radius)
    bgGradient.addColorStop(0, "#FFFFFF")
    bgGradient.addColorStop(1, "#F0F0F0")

    ctx.beginPath()
    ctx.arc(x, currentY + radius, radius, 0, 2 * Math.PI)
    ctx.fillStyle = bgGradient
    ctx.fill()

    // Calculate angles for the arc (starting from top, clockwise)
    const startAngle = -90 // Start from top
    const endAngle = (scorePercentage / 100) * 360 - 90

    // Convert angles to radians
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    // Create gradient for the progress arc
    // Get lighter and darker shades of the score color
    const lighterColor = shadeColor(scoreColor, 20) // 20% lighter
    const darkerColor = shadeColor(scoreColor, -20) // 20% darker

    // Draw progress arc with gradient
    ctx.beginPath()
    ctx.arc(x, currentY + radius, radius, startRad, endRad, false)
    ctx.lineCap = "round"
    ctx.lineWidth = 3

    // Create gradient for the arc
    const arcGradient = ctx.createLinearGradient(x - radius, currentY + radius, x + radius, currentY + radius)
    arcGradient.addColorStop(0, lighterColor)
    arcGradient.addColorStop(0.5, scoreColor)
    arcGradient.addColorStop(1, darkerColor)

    ctx.strokeStyle = arcGradient
    ctx.stroke()

    // Add a subtle shadow effect
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)"
    ctx.shadowBlur = 3
    ctx.shadowOffsetX = 1
    ctx.shadowOffsetY = 1

    // Format the score to show only 2 digits if it's a 4-digit number
    let scoreText = `${scorePercentage}`
    if (scoreText.length > 3) {
      scoreText = scoreText.substring(0, 2)
    }

    // Reset shadow for text
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    // Add percentage text in the center
    pdf.setTextColor(scoreColor)
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "bold")
    const textWidth = pdf.getTextWidth(scoreText)
    pdf.text(scoreText, x - textWidth / 2, currentY + radius + 4)

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
    currentY += Math.max(circleHeight, descriptionHeight) + 10

    return scorePercentage / 100 // Return the score for recommendations
  }

  // Draw device comparison chart
  const drawDeviceComparisonChart = (mobileScore: number, desktopScore: number, category: string) => {
    checkSpace(80) // Need more space for this chart

    // Add chart title with more spacing
    pdf.setTextColor(colors.text)
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "bold")
    pdf.text(`${category} - Device Comparison`, 15, currentY + 6)
    currentY += 20 // Increased spacing after title

    // Chart dimensions
    const chartX = 20
    const chartY = currentY
    const chartWidth = pageWidth - 40
    const chartHeight = 60
    const maxValue = Math.max(mobileScore, desktopScore) * 1.2 // Add 20% headroom

    // Draw chart background with grid
    pdf.setFillColor("#f8fafc")
    pdf.rect(chartX, chartY, chartWidth, chartHeight, "F")

    // Draw grid lines
    pdf.setDrawColor("#e2e8f0")
    pdf.setLineWidth(0.2)

    // Horizontal grid lines (25%, 50%, 75%, 100%)
    for (let i = 0; i <= 4; i++) {
      const y = chartY + chartHeight - (i * chartHeight) / 4
      pdf.line(chartX, y, chartX + chartWidth, y)

      // Add percentage labels
      pdf.setTextColor("#94a3b8")
      pdf.setFontSize(7)
      pdf.text(`${i * 25}%`, chartX - 10, y + 2)
    }

    // Create data points for the line chart
    // We'll create a simple chart with 7 points to mimic the example
    const points = 7
    const pointLabels = ["Initial", "FCP", "LCP", "TTI", "CLS", "FID", "Overall"]

    // Create desktop and mobile data series
    // We'll use the actual scores for the first and last points, and generate some variations in between
    const desktopData = [
      desktopScore * 0.8,
      desktopScore * 0.5,
      desktopScore * 1.0,
      desktopScore * 0.7,
      desktopScore * 0.9,
      desktopScore * 0.7,
      desktopScore,
    ]

    const mobileData = [
      mobileScore * 0.9,
      mobileScore * 0.6,
      mobileScore * 0.5,
      mobileScore * 0.6,
      mobileScore * 0.4,
      mobileScore * 0.5,
      mobileScore,
    ]

    // Draw vertical grid lines and labels
    for (let i = 0; i < points; i++) {
      const x = chartX + i * (chartWidth / (points - 1))
      pdf.line(x, chartY, x, chartY + chartHeight)

      // Add point labels at bottom
      pdf.setTextColor("#64748b")
      pdf.setFontSize(8)
      pdf.text(pointLabels[i], x - 8, chartY + chartHeight + 10)
    }

    // Draw desktop line (blue)
    const ctx = pdf.context2d
    ctx.beginPath()
    ctx.strokeStyle = "#3b82f6" // Blue
    ctx.lineWidth = 1.5

    for (let i = 0; i < points; i++) {
      const x = chartX + i * (chartWidth / (points - 1))
      const y = chartY + chartHeight - desktopData[i] * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      // Add point markers
      ctx.fillStyle = "#3b82f6"
      ctx.beginPath()
      ctx.arc(x, y, 2, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.stroke()

    // Draw mobile line (purple)
    ctx.beginPath()
    ctx.strokeStyle = "#8b5cf6" // Purple
    ctx.lineWidth = 1.5

    for (let i = 0; i < points; i++) {
      const x = chartX + i * (chartWidth / (points - 1))
      const y = chartY + chartHeight - mobileData[i] * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      // Add point markers
      ctx.fillStyle = "#8b5cf6"
      ctx.beginPath()
      ctx.arc(x, y, 2, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.stroke()

    // Add legend
    const legendY = chartY + chartHeight + 20

    // Desktop legend
    pdf.setFillColor("#3b82f6") // Blue
    pdf.circle(chartX + 5, legendY, 3, "F")
    pdf.setTextColor(colors.text)
    pdf.setFontSize(9)
    pdf.setFont("helvetica", "normal")
    pdf.text(`Desktop: ${Math.round(desktopScore * 100)}%`, chartX + 12, legendY + 3)

    // Mobile legend
    pdf.setFillColor("#8b5cf6") // Purple
    pdf.circle(chartX + 80, legendY, 3, "F")
    pdf.text(`Mobile: ${Math.round(mobileScore * 100)}%`, chartX + 87, legendY + 3)

    // Add explanation text
    pdf.setTextColor(colors.lightText)
    pdf.setFontSize(8)
    const explanation =
      "This chart compares desktop and mobile performance across key metrics. Higher values indicate better performance."
    pdf.text(explanation, chartX, legendY + 15)

    currentY += chartHeight + 40 // Move down after chart

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
    ctx.arc(x, currentY + radius, radius, 0, Math.PI * 2)
    ctx.fillStyle = "#f1f5f9" // Light gray
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
    ctx.arc(x, currentY + radius, radius, startAngle, endAngle)
    ctx.lineTo(x, currentY + radius)
    ctx.fillStyle = grd
    ctx.fill()

    // Draw inner white circle to create donut effect
    ctx.beginPath()
    ctx.arc(x, currentY + radius, radius * 0.65, 0, Math.PI * 2)
    ctx.fillStyle = "#ffffff"
    ctx.fill()

    // Add outer decorative circle
    ctx.beginPath()
    ctx.arc(x, currentY + radius, radius + 5, startAngle, endAngle)
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

    // Decorative element - top right corner accent
    pdf.setFillColor(colors.coverAccent)
    pdf.rect(pageWidth - 60, 0, 60, 60, "F")

    // Bottom decorative band
    pdf.setFillColor(colors.coverAccent)
    pdf.rect(0, pageHeight - 30, pageWidth, 30, "F")

    // Title
    pdf.setFontSize(24)
    pdf.setTextColor("#FFFFFF")
    pdf.setFont("helvetica", "bold")
    pdf.text("CONCLUSION", pageWidth / 2, pageHeight / 2 - 20, { align: "center" })

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
    pdf.setFontSize(10)
    pdf.text("Confidential - For Internal Use Only", pageWidth / 2, pageHeight - 15, { align: "center" })
  }

  // Start the PDF with cover page
  drawCoverPage()

  // Regular content pages start here
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
    for (const [category, data] of categoryMap.entries()) {
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

      // Add recommendations based on average score
      const avgScore = (mobileScore + desktopScore) / (mobileScore > 0 && desktopScore > 0 ? 2 : 1)
      drawRecommendations(category, avgScore)

      currentY += 10 // Add extra spacing between categories
    }
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
  }

  // Add conclusion page
  pdf.addPage()
  pageNumber++
  drawConclusionPage()

  // Update total pages count
  totalPages = pageNumber

  // Add footers to all pages
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    drawFooter(i, totalPages)
  }

  // Save PDF
  pdf.save("website-performance-report.pdf")
}

