import jsPDF from "jspdf";
import type { PageAnalysisResponse } from "../modules/seo-analytics/types/analysisResponse";
import { getAIAnalysis } from "../modules/seo-analytics/services/IA.service";

export interface EnhancedPageAnalysisResponse extends PageAnalysisResponse {
  aiAnalysis?: {
    sections: Record<
      string,
      {
        analysis: string;
        recommendations: string[];
        conclusions?: string;
      }
    >;
    fullAnalysis: string;
  };
  onPageAnalysis: {
    analysis: string;
    recommendations: string[];
    conclusions?: string;
  };

  companyInfo?: {
    logo: string | null;
    name: string;
    contactEmail: string;
    contactPhone: string;
    website: string;
  };
}

// Typography system - standardizing fonts across the entire document
const typography = {
  fontFamily: "helvetica",
  fontSize: {
    h1: 18,
    h2: 14,
    h3: 12,
    body: 10,
    bodySmall: 9,
    caption: 8
  },
  fontWeight: {
    normal: "normal",
    bold: "bold",
    italic: "italic"
  }
};

// Color palette - Based on the design
const colors = {
  background: "#FFFFFF",
  primary: "#1665C0",         // Updated to match image blue
  secondary: "#1E88E5",       // Medium blue for subheaders
  accent: "#FFD700",          // Gold for accents
  text: "#666666",            // Main text
  lightText: "#666666",       // Secondary text
  good: "#0CCE6B",            // Good scores (green)
  average: "#FFA400",         // Average scores (amber)
  poor: "#FF4E42",            // Poor scores (red)
  border: "#E0E0E0",          // Borders
  lightBg: "#F5F7FA",         // Light background
  sectionBg: "#EEF2F7",       // Section background
  headerBg: "#1665C0",        // Header background - Updated to match image blue
  coverBg: "#FFFFFF",         // Cover background
  coverAccent: "#1665C0",     // Cover accent
};


export async function generateFreeReportPDF(pageAnalysis: EnhancedPageAnalysisResponse): Promise<void> {
  // Create PDF document
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Get AI analysis
  const aiAnalysisResult = await getAIAnalysis(pageAnalysis);

  // Print all available keys for debugging
  console.log("Available keys in aiAnalysisResult.sections:", Object.keys(aiAnalysisResult.sections));

  // Page dimensions
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Tracking current position and page number
    let currentY = 25;
    let pageNumber = 1;
    let totalPages = 0;

    // Helper functions
    const truncateText = (text: string, maxLength: number): string => {
      if (text && text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
      }
      return text || "";
    };
    // Check if we need a new page
    const checkSpace = (requiredHeight: number) => {
      if (currentY + requiredHeight > pageHeight - 25) {
        pdf.addPage();
        pageNumber++;
        currentY = 25;
        drawHeader();
      }
    };

  // Función mejorada para crear una portada más profesional
  const drawCoverPage = () => {
    pdf.setFillColor("#FFFFFF");
    pdf.rect(0, 0, pageWidth, pageHeight, "F");
  
    // Left blue section with checker pattern
    pdf.setFillColor("#1665C0");
    pdf.rect(0, 0, pageWidth * 0.35, pageHeight * 0.7, "F");
    drawCheckerPattern(0, 0, pageWidth * 0.35, pageHeight * 0.7, "#0A3B8C", 10);
  
    const reportId = `REP-${Date.now().toString().substring(6)}`;
    pdf.setFontSize(typography.fontSize.caption);
    pdf.setTextColor("#FFFFFF");
    pdf.setFont("helvetica", "normal");
    pdf.text(`ID: ${reportId}`, 15, 15);
  
    // Logo placement
    try {
      const logoWidth = 50;
      const logoHeight = 50;
      const logoX = 30;
      const logoY = 30;
  
      if (pageAnalysis.companyInfo?.logo) {
        const logoUrl = pageAnalysis.companyInfo.logo.toLowerCase();
        let format = "PNG"; // Default format
  
        if (logoUrl.endsWith(".svg")) {
          format = "SVG";
        } else if (logoUrl.endsWith(".jpg") || logoUrl.endsWith(".jpeg")) {
          format = "JPEG";
        }
  
        pdf.addImage(pageAnalysis.companyInfo.logo, format, logoX, logoY, logoWidth, logoHeight);
      } else {
        pdf.addImage(
          'https://pplx-res.cloudinary.com/image/upload/v1743881513/user_uploads/kxfXyhGFItaKuNC/logo.jpg',
          'JPEG',
          logoX,
          logoY,
          logoWidth,
          logoHeight
        );
      }
    } catch (error) {
      console.error("Error adding logo:", error);
      pdf.setFillColor("#1665C0");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(24);
      pdf.setTextColor("#333333");
      pdf.text("LOGO", 30, 50);
    }
  
    // White middle section with checker pattern
    pdf.setFillColor("#FFFFFF");
    const whiteAreaX = pageWidth * 0.35;
    const whiteAreaY = 0;
    const whiteAreaWidth = pageWidth * 0.65;
    const whiteAreaHeight = pageHeight * 0.7;
    pdf.rect(whiteAreaX, whiteAreaY, whiteAreaWidth, whiteAreaHeight, "F");
    
    // Add checker pattern to white area (light gray)
    drawCheckerPattern(whiteAreaX, whiteAreaY, whiteAreaWidth, whiteAreaHeight, "#DDDDDD", 10);
  
    // Small blue accent rectangle
    pdf.setFillColor("#1665C0");
    pdf.rect(pageWidth - 50, 30, 30, 8, "F");
  
    // Company name and report title
    const companyName = pageAnalysis.companyInfo?.name || "Tamer Digital";
    pdf.setFontSize(28);
    pdf.setTextColor("#333333");
    pdf.setFont("helvetica", "bold");
    pdf.text(companyName, whiteAreaX + whiteAreaWidth / 2, 100, { align: "center" });
  
    pdf.setFontSize(22);
    pdf.setTextColor("#1665C0");
    pdf.setFont("helvetica", "bold");
    pdf.text("SEO REPORT", whiteAreaX + whiteAreaWidth / 2, 130, { align: "center" });
  
    pdf.setFontSize(18);
    pdf.setTextColor("#666666");
    pdf.setFont("helvetica", "normal");
    pdf.text("Web Performance Analysis", whiteAreaX + whiteAreaWidth / 2, 150, { align: "center" });
  
    // URL section
    pdf.setFontSize(12);
    pdf.setTextColor("#0D47A1");
    pdf.setFont("helvetica", "bold");
    pdf.text("ANALYZED URL:", whiteAreaX + whiteAreaWidth / 2, 180, { align: "center" });
  
    pdf.setFontSize(11);
    pdf.setTextColor("#333333");
    pdf.setFont("helvetica", "normal");
    const urlLines = pdf.splitTextToSize(pageAnalysis.url || "example.com", 200);
    pdf.text(urlLines, whiteAreaX + whiteAreaWidth / 2, 195, { align: "center" });
  
    // Bottom dark blue section
    pdf.setFillColor("#0A2240");
    const darkBlueStartY = pageHeight * 0.7;
    const darkBlueWidth = pageWidth * 0.85; // Ancho del cuadro azul (ajústalo según necesites)
    const darkBlueHeight = pageHeight * 0.25; // Altura del cuadro azul (para que no llegue hasta el final)
    pdf.rect(0, darkBlueStartY, darkBlueWidth, darkBlueHeight, "F");
    // Quote section
    pdf.setFontSize(10);
    pdf.setTextColor("#FFFFFF");
    pdf.setFont("helvetica", "italic");
    const quote = "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled";
    const quoteLines = pdf.splitTextToSize(quote, 260);
    pdf.text(quoteLines, 25, pageHeight * 0.7 + 110);
  
    // Contact information - centered as requested
    pdf.setFontSize(12);
    pdf.setTextColor("#FFFFFF");
    pdf.setFont("helvetica", "bold");
    pdf.text("CONTACT INFORMATION", pageWidth / 2, pageHeight * 0.7 + 30, { align: "center" });
  
    pdf.setFontSize(10);
    pdf.setTextColor("#FFFFFF");
    pdf.setFont("helvetica", "normal");
  
    const email = pageAnalysis.companyInfo?.contactEmail || "contact@tamerdigital.com";
    const phone = pageAnalysis.companyInfo?.contactPhone || "+1 234 567 890";
    const website = pageAnalysis.companyInfo?.website || "www.tamerdigital.com";
  
    pdf.text(`Email: ${email}`, pageWidth / 2, pageHeight * 0.7 + 45, { align: "center" });
    pdf.text(`Phone: ${phone}`, pageWidth / 2, pageHeight * 0.7 + 55, { align: "center" });
    pdf.text(`Web: ${website}`, pageWidth / 2, pageHeight * 0.7 + 65, { align: "center" });
  
    // Current year and report type (like the 2030 COMPANY PROFILE in the example)

  
    // Generation date
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  
    pdf.setFontSize(9);
    pdf.setTextColor("#FFFFFF");
    pdf.setFont("helvetica", "italic");
    pdf.text(`Generated on: ${date}`, pageWidth - 20, pageHeight - 10, { align: "right" });
  
    pageNumber++;
  };
  
  // Helper function to draw checker pattern
  function drawCheckerPattern(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    size: number,
  ): void {
    pdf.setDrawColor(color);
    pdf.setLineWidth(0.2);
  
    for (let i = 0; i <= height; i += size) {
      pdf.line(x, y + i, x + width, y + i);
    }
  
    for (let i = 0; i <= width; i += size) {
      pdf.line(x + i, y, x + i, y + height);
    }
  }

  // Draw header on each page
  const drawHeader = () => {
    pdf.setFillColor(colors.headerBg)
    pdf.rect(0, 0, pageWidth, 15, "F")
    pdf.setTextColor("#FFFFFF")
    pdf.setFontSize(typography.fontSize.h2)
    pdf.setFont("helvetica", "bold")
    pdf.text("Website Performance Report", 10, 10)
    pdf.setFontSize(typography.fontSize.caption)
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
    pdf.setFontSize(typography.fontSize.caption)
    pdf.text("Automatically generated report", 10, pageHeight - 5)
    pdf.text(`Page ${pageNum} of ${totalPgs}`, pageWidth - 10, pageHeight - 5, { align: "right" })
  }

  // Draw section header
  const drawSectionHeader = (title: string) => {
    checkSpace(15)
    pdf.setFillColor(colors.headerBg)
    pdf.rect(10, currentY, pageWidth - 20, 10, "F")
    pdf.setTextColor("#FFFFFF")
    pdf.setFontSize(typography.fontSize.h3)
    pdf.setFont("helvetica", "bold")
    pdf.text(title, 15, currentY + 7)
    currentY += 15
  }

  const getAIAnalysisForSection = (category: string, deviceType: string) => {
    // Try both formats - with underscore and with hyphen
    const normalizedCategoryUnderscore = category.replace(/-/g, "_").toUpperCase();
    const normalizedCategoryHyphen = category.toUpperCase(); // Keep hyphens intact
    
    const sectionKeyUnderscore = `${deviceType.toUpperCase()}_${normalizedCategoryUnderscore}`;
    const sectionKeyHyphen = `${deviceType.toUpperCase()}_${normalizedCategoryHyphen}`;
    
    console.log(`Looking for AI analysis for: ${sectionKeyUnderscore} or ${sectionKeyHyphen}`);
  
    // First try to get the exact analysis with underscore
    let section = aiAnalysisResult.sections?.[sectionKeyUnderscore];
    
    // If not found, try with hyphen format
    if (!section) {
      section = aiAnalysisResult.sections?.[sectionKeyHyphen];
    }
  
    // If still not found, look for alternatives
    if (!section) {
      const alternativeKeys = Object.keys(aiAnalysisResult.sections || {}).filter(
        (key) => key.includes(deviceType.toUpperCase()) && 
                (key.includes(normalizedCategoryUnderscore) || 
                 key.includes(normalizedCategoryHyphen))
      );
  
      // If we found an alternative key, use the first valid option
      if (alternativeKeys.length > 0) {
        const alternativeKey = alternativeKeys[0];
        console.log(`Using alternative key: ${alternativeKey}`);
        return aiAnalysisResult.sections[alternativeKey];
      }
  
      console.log(`No analysis found for ${category} ${deviceType}`);
      return null;
    }
  
    // Verify if the found section has analysis, recommendations and conclusions
    if (!section.analysis || !section.recommendations || !section.conclusions) {
      console.log(`Incomplete analysis for ${section ? 'found key' : 'null section'}, returning null.`);
      return null;
    }
  
    return section;
  };
// Enhanced recommendations section with table layout
const drawRecommendations = (category: string, _score: number) => {
  checkSpace(30);

  // Create a visually distinct recommendations section header with black background
  const ctx = pdf.context2d;
  ctx.fillStyle = "#1665C0"; // Black background
  ctx.fillRect(15, currentY, pageWidth - 30, 10);

  pdf.setTextColor("#FFFFFF"); // White text for better contrast
  pdf.setFontSize(typography.fontSize.h3);
  pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
  pdf.text("Recomendations", 25, currentY + 7);
  currentY += 15;

  const normalizedCategory = category.replace(/-/g, "_").toUpperCase();
  let recommendations: string[] = [];

  if (aiAnalysisResult.recommendations && aiAnalysisResult.recommendations[normalizedCategory]) {

    recommendations = Array.from(new Set(aiAnalysisResult.recommendations[normalizedCategory]));
  }

  // Table headers
  pdf.setFillColor(colors.sectionBg);
  pdf.rect(20, currentY, pageWidth - 30, 10, "F");
  pdf.setTextColor("#FFFFFF"); // Black text
  pdf.setFontSize(typography.fontSize.bodySmall);
  pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
  pdf.text("Priority", 25, currentY + 7);
  pdf.text("Recomendation", 70, currentY + 7);
  currentY += 15;

  if (recommendations.length === 0) {
    pdf.setTextColor(colors.text);
    pdf.setFontSize(typography.fontSize.bodySmall);
    pdf.setFont(typography.fontFamily, typography.fontWeight.normal);
    pdf.text("No specific recommendations for this category.", 25, currentY + 6);
    currentY += 15;
  } else {
    recommendations.forEach((recommendation, index) => {
      checkSpace(15);
  
      // Alternating row background
      pdf.setFillColor(index % 2 === 0 ? colors.lightBg : colors.background);
      pdf.rect(20, currentY, pageWidth - 40, 20, "F");
      
      // Priority level (High/Medium/Low based on index) - fixing the format
      const priorityLevel = index < 2 ? "High" : index < 4 ? "Medium" : "Low";
      const priorityText = priorityLevel + " Priority"; // Proper formatting
      
      pdf.setTextColor(
        priorityLevel === "High" ? colors.poor :
        priorityLevel === "Medium" ? colors.average :
        colors.good
      );
      pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
      pdf.text(priorityText, 25, currentY + 12);
      
      // Recommendation text
      pdf.setTextColor(colors.text);
      pdf.setFont(typography.fontFamily, typography.fontWeight.normal);
      const textWidth = pageWidth - 80;
      const recommendationLines = pdf.splitTextToSize(recommendation, textWidth);
      pdf.text(recommendationLines, 70, currentY + 12);
      
      currentY += Math.max(20, recommendationLines.length * 6 + 6);
    });
  }

  currentY += 10;
};

// Enhanced device comparison chart with better styling and English labels
// Enhanced device comparison chart with better styling and English labels
const drawDeviceComparisonChart = (mobileScore: number, desktopScore: number, category: string) => {
  // Reduced chart height for better fit
  const chartHeight = 80;
  const chartMargin = 20;
  checkSpace(chartHeight + 100); // Space for chart, icons and bottom note
  const pageWidth = pdf.internal.pageSize.getWidth();
  const chartWidth = pageWidth - chartMargin * 2;
  const chartX = chartMargin;
  const theme = {
    mobileColor: colors.good + "90",
    mobileBorder: colors.good,
    desktopColor: colors.primary + "90",
    desktopBorder: colors.primary,
    gridColor: colors.border,
    textPrimary: colors.text,
    textSecondary: colors.lightText,
    fontFamily: typography.fontFamily,
  };
    
  // Title
  pdf.setFont(theme.fontFamily, typography.fontWeight.bold);
  pdf.setFontSize(typography.fontSize.h2);
  pdf.setTextColor(theme.textPrimary);
  pdf.text("Performance Comparison: Mobile vs Desktop", pageWidth / 2, currentY + 10, { align: "center" });
    
  // Icons just below the title
  const titleBottomY = currentY + 20; // 10 points below title
    
  // Horizontally centered icons
  const leftSide = pageWidth / 3;
  const rightSide = (pageWidth / 3) * 2;
    
  // Percentage labels next to icons
  pdf.setFontSize(typography.fontSize.body);
    
  // Mobile icon - left side
  pdf.setDrawColor("#D1D5DB");
  pdf.setLineWidth(0.5);
  pdf.roundedRect(leftSide - 7, titleBottomY, 14, 20, 2, 2, "S");
  pdf.setFillColor("#D1D5DB");
  pdf.circle(leftSide, titleBottomY + 17, 1, "F");
    
  // Mobile label
  pdf.setTextColor(theme.mobileBorder);
  pdf.text(`Mobile (${Math.round(mobileScore * 100)}%)`, leftSide + 15, titleBottomY + 10, { align: "left" });
    
  // Enhanced desktop icon - right side
  // Monitor
  pdf.setDrawColor("#D1D5DB");
  pdf.setLineWidth(0.5);
  pdf.roundedRect(rightSide - 10, titleBottomY + 4, 20, 12, 1, 1, "S");
    
  // Monitor base
  pdf.setFillColor("#D1D5DB");
  // Vertical support
  pdf.rect(rightSide - 2, titleBottomY + 16, 4, 4, "F");
  // Horizontal base
  pdf.rect(rightSide - 6, titleBottomY + 20, 12, 1.5, "F");
    
  // Screen
  pdf.setFillColor("#9CA3AF");
  pdf.roundedRect(rightSide - 5, titleBottomY + 8, 10, 6, 0.5, 0.5, "F");
    
  // Desktop label
  pdf.setTextColor(theme.desktopBorder);
  pdf.text(`Desktop (${Math.round(desktopScore * 100)}%)`, rightSide + 15, titleBottomY + 10, { align: "left" });
    
  // Adjust Y position for chart after icons
  // Reduce space between icons and chart
  const chartY = titleBottomY + 35; // Reduced from 45 to 35 to raise the chart
  currentY = titleBottomY + 10;
    
  // Chart background
  pdf.setFillColor(colors.background);
  pdf.setDrawColor(colors.border);
  pdf.roundedRect(chartX, chartY, chartWidth, chartHeight, 3, 3, "FD");
    
  // Y-axis labels and grid lines
  pdf.setFontSize(typography.fontSize.bodySmall);
  pdf.setTextColor(theme.textSecondary);
  [0, 25, 50, 75, 100].forEach((value) => {
    const y = chartY + chartHeight - (chartHeight * (value / 100));
    pdf.text(`${value}%`, chartX - 10, y + 3, { align: "right" });
    pdf.setDrawColor(theme.gridColor);
    pdf.setLineWidth(0.2);
    pdf.line(chartX + 10, y, chartX + chartWidth - 10, y);
  });
    
  // Metrics data
  const metrics = [
    { name: "Initial", mobile: 0.75, desktop: 0.82 },
    { name: "FCP", mobile: 0.73, desktop: 0.85 },
    { name: "LCP", mobile: 0.68, desktop: 0.78 },
    { name: "TTI", mobile: 0.72, desktop: 0.82 },
    { name: "CLS", mobile: 0.75, desktop: 0.87 },
    { name: "FID", mobile: 0.70, desktop: 0.80 },
    { name: "Overall", mobile: mobileScore, desktop: desktopScore },
  ];
    
  // Draw straight lines
  const drawStraightLine = (data: number[], color: string, borderColor: string) => {
    const ctx = pdf.context2d;
    ctx.beginPath();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
        
    data.forEach((value, i) => {
      const x = chartX + 30 + i * ((chartWidth - 60) / (metrics.length - 1));
      const y = chartY + chartHeight - (chartHeight * value);
            
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
        
    ctx.stroke();
  };
    
  // Draw lines for desktop and mobile
  drawStraightLine(metrics.map((m) => m.desktop), theme.desktopColor, theme.desktopBorder);
  drawStraightLine(metrics.map((m) => m.mobile), theme.mobileColor, theme.mobileBorder);
    
  // Draw smaller points
  metrics.forEach((metric, i) => {
    const x = chartX + 30 + i * ((chartWidth - 60) / (metrics.length - 1));
        
    const drawPoint = (value: number, color: string) => {
      const y = chartY + chartHeight - (chartHeight * value);
      const ctx = pdf.context2d;
            
      // Smaller point (reduced from 1.5 to 1)
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2, false);
      ctx.fillStyle = colors.background;
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.3; // Thinner line (reduced from 0.5 to 0.3)
      ctx.stroke();
    };
        
    drawPoint(metric.desktop, theme.desktopBorder);
    drawPoint(metric.mobile, theme.mobileBorder);
  });
    
  // X-axis labels
  pdf.setFontSize(typography.fontSize.bodySmall);
  pdf.setTextColor(theme.textPrimary);
  metrics.forEach((metric, i) => {
    const x = chartX + 30 + i * ((chartWidth - 60) / (metrics.length - 1));
    pdf.text(metric.name, x, chartY + chartHeight + 15, { align: "center" });
  });
    
  // Centered legend with circles
  const legendY = chartY + chartHeight + 35;
  const legendCenterX = pageWidth / 2;
  pdf.setFontSize(typography.fontSize.bodySmall);
  pdf.setFont(theme.fontFamily, typography.fontWeight.bold);
    
  // Mobile legend with circle
  pdf.setTextColor(theme.mobileBorder);
  pdf.text("Mobile", legendCenterX - 40, legendY);
  pdf.setFillColor(theme.mobileBorder);
  pdf.circle(legendCenterX - 50, legendY - 3, 2, "F");
    
  // Desktop legend with circle
  pdf.setTextColor(theme.desktopBorder);
  pdf.text("Desktop", legendCenterX + 20, legendY);
  pdf.setFillColor(theme.desktopBorder);
  pdf.circle(legendCenterX + 10, legendY - 3, 2, "F");
    
  // Bottom note with conclusion
  pdf.setFontSize(typography.fontSize.bodySmall);
  pdf.setTextColor(theme.textSecondary);
  pdf.text(
    "This chart compares performance between mobile and desktop devices. Higher values indicate better performance.",
    pageWidth / 2,
    chartY + chartHeight + 55,
    { align: "center" }
  );
  
  // Added conclusion to help understand the comparison better
  const performanceGap = Math.round((desktopScore - mobileScore) * 100);
  let conclusionText = "";
  
  if (performanceGap > 15) {
    conclusionText = `Conclusion: Desktop performance is significantly better (${performanceGap}% higher) than mobile. Focus on optimizing the mobile experience to reduce this gap.`;
  } else if (performanceGap > 5) {
    conclusionText = `Conclusion: Desktop performance is moderately better (${performanceGap}% higher) than mobile. Consider mobile-specific optimizations to improve user experience.`;
  } else if (performanceGap >= 0) {
    conclusionText = `Conclusion: Desktop and mobile performance are relatively balanced (${performanceGap}% difference). Continue maintaining both experiences equally.`;
  } else {
    conclusionText = `Conclusion: Mobile performance is better than desktop by ${Math.abs(performanceGap)}%. This is unusual - verify desktop optimizations are properly implemented.`;
  }
  
  pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
  pdf.setTextColor(colors.primary);
  const conclusionLines = pdf.splitTextToSize(conclusionText, pageWidth - 50);
  pdf.text(conclusionLines, pageWidth / 2, chartY + chartHeight + 70, { align: "center" });
    
  currentY = chartY + chartHeight + 70 + (conclusionLines.length * 5) + 10; // Adjusted for conclusion text
};

// Modified function to draw the progress circle with AI analysis
const drawCircleProgress = (score: number, label: string, x = 30, radius = 15) => {
  checkSpace(radius * 2 + 15);
  const scorePercentage = Math.round(score * 100);
  
  // Usar la tipografía estándar del reporte para el título
  pdf.setTextColor(colors.text);
  pdf.setFontSize(typography.fontSize.h3);
  pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
  pdf.text(label, 25, currentY + 6);
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
  
  // Usar la tipografía estándar del reporte para el porcentaje
  pdf.setTextColor(gradientStart);
  pdf.setFontSize(typography.fontSize.body);
  pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
  const textWidth = pdf.getTextWidth(scoreText);
  pdf.text(scoreText, x - textWidth / 2, currentY + radius + 3);
  
  // Determine category for recommendations
  const deviceType = label.toLowerCase().includes("mobile") ? "mobile" : "desktop";
  let category = label.toLowerCase().replace(`${deviceType} - `, "").replace(/\s+/g, "-");
  if (label.includes("On-page Score")) {
    category = "on_page_specific";
  }
  
  // Collect recommendations without rendering analysis or conclusions
  const aiAnalysis = category === "on_page_specific" ? aiAnalysisResult.onPageAnalysis : getAIAnalysisForSection(category, deviceType);
  
  // Render analysis text to the right of the circle
  const descriptionX = x + radius * 2 + 10;
  const descriptionWidth = pageWidth - descriptionX - 15;
  
  if (aiAnalysis && aiAnalysis.analysis) {
    // Usar la tipografía estándar del reporte para el análisis
    pdf.setTextColor(colors.text);
    pdf.setFontSize(typography.fontSize.body); // Cambiado de caption a body para consistencia
    pdf.setFont(typography.fontFamily, typography.fontWeight.normal);
    
    // Alinear el texto con la parte superior del círculo para mejor balance visual
    const analysisLines = pdf.splitTextToSize(aiAnalysis.analysis, descriptionWidth);
    pdf.text(analysisLines, descriptionX, currentY + radius - (analysisLines.length * 3) / 2);
    
    // Store recommendations for the recommendations section
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
    
    const circleHeight = radius * 2;
    const analysisHeight = analysisLines.length * 5 + 10;
    currentY += Math.max(circleHeight, analysisHeight) + 10;
  } else {
    currentY += radius * 2 + 15;
  }
  
  return score;
};

  // Draw status icon (check or X)
  const drawStatusIcon = (x: number, isGood: boolean) => {
    const iconSize = 3;
    if (isGood) {
      // Draw a check mark for good/pass status
      pdf.setDrawColor(colors.good);
      pdf.setLineWidth(0.8);
      pdf.line(x - iconSize / 2, currentY + 3, x - iconSize / 6, currentY + 4);
      pdf.line(x - iconSize / 6, currentY + 4, x + iconSize / 2, currentY + 1);
    } else {
      // Draw an X for poor/fail status
      pdf.setDrawColor(colors.poor);
      pdf.setLineWidth(0.8);
      pdf.line(x - iconSize / 2, currentY + 1, x + iconSize / 2, currentY + 4);
      pdf.line(x - iconSize / 2, currentY + 4, x + iconSize / 2, currentY + 1);
    }
  };

  // Draw metrics table
  const drawMetricsTable = (metrics: any[], deviceType: string) => {
    checkSpace(15);
    pdf.setFillColor(colors.sectionBg);
    pdf.rect(10, currentY, pageWidth - 20, 10, "F");
    pdf.setTextColor(colors.text);
    pdf.setFontSize(typography.fontSize.body);
    pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
    pdf.text(`${deviceType} Metrics`, 15, currentY + 7);
    pdf.text("Value", pageWidth - 70, currentY + 7);
    pdf.text("Status", pageWidth - 25, currentY + 7);
    currentY += 15;

    if (metrics && metrics.length > 0) {
      metrics.forEach((metric, metricIndex) => {
        checkSpace(10);
        const metricNameMaxWidth = pageWidth - 90;
        const metricName = metric.name;
        const metricNameLines = pdf.splitTextToSize(metricName, metricNameMaxWidth);
        const lineHeight = 8;
        const rowHeight = metricNameLines.length * lineHeight;
        pdf.setFillColor(metricIndex % 2 === 0 ? colors.lightBg : colors.background);
        pdf.rect(10, currentY, pageWidth - 20, rowHeight, "F");
        pdf.setTextColor(colors.text);
        pdf.setFontSize(typography.fontSize.bodySmall);
        pdf.setFont(typography.fontFamily, typography.fontWeight.normal);
        pdf.text(metricNameLines, 15, currentY + 6);
        const metricValue = metric.value;
        pdf.text(metricValue, pageWidth - 70, currentY + 6);

        // EXPLICIT CHECK FOR PASS/FAIL STATUS
        let isGood = true;

        // First check if there's an explicit status
        if (metric.status) {
          // If status is explicitly "fail", show X
          if (metric.status.toLowerCase() === "fail") {
            isGood = false;
          }
          // If status is explicitly "pass", show check
          else if (metric.status.toLowerCase() === "pass") {
            isGood = true;
          }
        } else {
          // If no explicit status, use heuristics
          if (
            metricName.toLowerCase().includes("load") ||
            metricName.toLowerCase().includes("time") ||
            metricName.toLowerCase().includes("size") ||
            metricName.toLowerCase().includes("delay")
          ) {
            const numericValue = Number.parseFloat(metricValue.replace(/[^0-9.]/g, ""));
            // For time/load/size metrics, lower is better
            isGood = !isNaN(numericValue) && numericValue < 3;
          }

          // Additional checks for common fail conditions
          if (
            metricValue.toLowerCase().includes("fail") ||
            metricValue.toLowerCase().includes("error") ||
            metricValue.toLowerCase().includes("high") ||
            metricValue.toLowerCase().includes("slow") ||
            metricValue.toLowerCase().includes("poor")
          ) {
            isGood = false;
          }
        }

        // Draw appropriate icon based on isGood value
        drawStatusIcon(pageWidth - 25, isGood);
        currentY += rowHeight;
      });
    }
  };

  // Draw issues table
  const drawIssuesTable = (issues: any[], deviceType: string) => {
    checkSpace(15);
    pdf.setFillColor(colors.sectionBg);
    pdf.rect(10, currentY, pageWidth - 20, 10, "F");
    pdf.setTextColor(colors.text);
    pdf.setFontSize(typography.fontSize.body);
    pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
    pdf.text(`${deviceType} Issues`, 15, currentY + 7);
    pdf.text("Status", pageWidth - 25, currentY + 7);
    currentY += 15;

    if (issues && issues.length > 0) {
      issues.forEach((issue, issueIndex) => {
        checkSpace(10);
        const issueTitleMaxWidth = pageWidth - 50;
        const issueTitle = issue.title;
        const issueTitleLines = pdf.splitTextToSize(`• ${issueTitle}`, issueTitleMaxWidth);
        const rowHeight = issueTitleLines.length * 5;
        pdf.setFillColor(issueIndex % 2 === 0 ? colors.lightBg : colors.background);
        pdf.rect(10, currentY, pageWidth - 20, rowHeight + 3, "F");
        pdf.setTextColor(colors.text);
        pdf.setFontSize(typography.fontSize.bodySmall);
        pdf.setFont(typography.fontFamily, typography.fontWeight.normal);
        pdf.text(issueTitleLines, 15, currentY + 6);

        // Issues are always displayed with X mark (false)
        drawStatusIcon(pageWidth - 25, false);
        currentY += rowHeight + 3;

        if (issue.description) {
          checkSpace(10);
          pdf.setTextColor(colors.lightText);
          pdf.setFontSize(typography.fontSize.caption);
          const descLines = pdf.splitTextToSize(issue.description, pageWidth - 50);
          pdf.text(descLines, 20, currentY + 4);
          currentY += descLines.length * 5 + 2;
        }
      });
    } else {
      checkSpace(10);
      pdf.setTextColor(colors.text);
      pdf.setFontSize(typography.fontSize.bodySmall);
      pdf.text("No issues found", 15, currentY + 6);
      // No issues is good (true)
      drawStatusIcon(pageWidth - 25, true);
      currentY += 10;
    }
  };

  // Draw conclusion page
  const drawConclusionPage = () => {
    // Set full page background to cover page bottom blue (#0A2240)
    pdf.setFillColor("#0A2240");
    pdf.rect(0, 0, pageWidth, pageHeight, "F");

    // Top bar
    pdf.setFillColor(colors.headerBg);
    pdf.rect(0, 0, pageWidth, 15, "F");
    pdf.setTextColor(colors.background);
    pdf.setFontSize(12);
    pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
    pdf.text("Final Insights", pageWidth / 2, 10, { align: "center" });

    // Title
    pdf.setFontSize(28);
    pdf.setTextColor("#FFFFFF");
    pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
    pdf.text("CONCLUSION", pageWidth / 2, 40, { align: "center" });

    // Decorative divider


    // Aggregate AI-generated conclusions
    const conclusions: string[] = [];

    if (aiAnalysisResult.sections) {
      Object.values(aiAnalysisResult.sections).forEach((section) => {
        if (section.conclusions) {
          conclusions.push(section.conclusions);
        }
      });
    }

    if (aiAnalysisResult.seoAnalysis?.conclusions) {
      conclusions.push(aiAnalysisResult.seoAnalysis.conclusions);
    }

    if (aiAnalysisResult.onPageAnalysis?.conclusions) {
      conclusions.push(aiAnalysisResult.onPageAnalysis.conclusions);
    }

    let generalConclusion = "";

    if (conclusions.length > 0) {
      generalConclusion = conclusions.join(" ");
      const maxLength = 1000;
      generalConclusion = generalConclusion.length > maxLength
        ? generalConclusion.substring(0, maxLength) + "..."
        : generalConclusion;
    } else {
      generalConclusion = `
        This comprehensive analysis highlights key areas for improving your website's performance, accessibility, and SEO.
        Implementing the recommended changes can significantly enhance user experience and search engine visibility.
      `;
    }

    // Conclusion text centered without box
    pdf.setFontSize(typography.fontSize.h2);
    pdf.setTextColor("#FFFFFF");
    pdf.setFont(typography.fontFamily, typography.fontWeight.normal);
    const conclusionLines = pdf.splitTextToSize(generalConclusion.trim(), pageWidth - 40);
    const conclusionHeight = conclusionLines.length * 6;
    const startY = (pageHeight - conclusionHeight) / 2;
    pdf.text(conclusionLines, pageWidth / 2, startY, { align: "center" });

    // Footer
    pdf.setFillColor(colors.primary);
    pdf.rect(0, pageHeight - 20, pageWidth, 20, "F");
    pdf.setFontSize(8);
    pdf.setTextColor(colors.background);
    pdf.text("CONFIDENTIAL", pageWidth / 2, pageHeight - 10, { align: "center" });
  };
  // Start the PDF with cover page
  drawCoverPage();
 // pdf.addPage();
  pageNumber = 2;
  currentY = 25;

  // Add a new page for the actual content


  // Draw the header on the second page (first content page)
  pdf.addPage();
  drawHeader();

  // Title
  pdf.setTextColor(colors.primary);
  pdf.setFontSize(typography.fontSize.h1);
  pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
  pdf.text("Website Performance Analysis", pageWidth / 2, currentY, { align: "center" });
  currentY += 15;

  // URL
  pdf.setTextColor(colors.text);
  pdf.setFontSize(typography.fontSize.h3);
  pdf.setFont(typography.fontFamily, typography.fontWeight.normal);
  pdf.text(`Analyzed URL: ${pageAnalysis.url}`, pageWidth / 2, currentY, { align: "center" });
  currentY += 15;

  // Speed Section
  if (pageAnalysis.speed) {
    // Group data by category
    const categoryMap = new Map();

    if (pageAnalysis.speed.mobile) {
      pageAnalysis.speed.mobile.forEach((category) => {
        if (!categoryMap.has(category.category)) {
          categoryMap.set(category.category, { mobile: null, desktop: null });
        }
        categoryMap.get(category.category).mobile = category;
      });
    }

    if (pageAnalysis.speed.desktop) {
      pageAnalysis.speed.desktop.forEach((category) => {
        if (!categoryMap.has(category.category)) {
          categoryMap.set(category.category, { mobile: null, desktop: null });
        }
        categoryMap.get(category.category).desktop = category;
      });
    }

    // Display each category with both mobile and desktop
    Array.from(categoryMap.entries()).forEach(([category, data]) => {
      checkSpace(20);
      drawSectionHeader(category);

      let mobileScore = 0;
      let desktopScore = 0;

      // Mobile data for this category
      if (data.mobile) {
        mobileScore = drawCircleProgress(data.mobile.score / 100, `Mobile - ${category}`);
        drawMetricsTable(data.mobile.metrics, "Mobile");
        drawIssuesTable(data.mobile.issues, "Mobile");
      }

      // Desktop data for this category
      if (data.desktop) {
        desktopScore = drawCircleProgress(data.desktop.score / 100, `Desktop - ${category}`);
        drawMetricsTable(data.desktop.metrics, "Desktop");
        drawIssuesTable(data.desktop.issues, "Desktop");
      }

      // Add comparison chart if we have both mobile and desktop data
      if (data.mobile && data.desktop) {
        drawDeviceComparisonChart(data.mobile.score / 100, data.desktop.score / 100, category);
      }

      // Add recommendations based on average score
      const avgScore = (mobileScore + desktopScore) / (mobileScore > 0 && desktopScore > 0 ? 2 : 1);
      drawRecommendations(category, avgScore);

      currentY += 10; // Add extra spacing between categories
    });
  }

  // SEO Analysis Section
  if (pageAnalysis.seo) {
    checkSpace(20);
    const seoScore = pageAnalysis.seo.page_metrics.onpage_score;
    // For on-page score, ensure we only show 2 digits when multiplied by 100
    const formattedSeoScore = Math.round(seoScore * 100);
    const displayScore = formattedSeoScore >= 1000 ? formattedSeoScore.toString().substring(0, 2) : formattedSeoScore;
    drawCircleProgress(seoScore, `On-page Score: ${displayScore}`);

    checkSpace(15);
    pdf.setFillColor(colors.sectionBg);
    pdf.rect(10, currentY, pageWidth - 20, 10, "F");
    pdf.setTextColor(colors.text);
    pdf.setFontSize(typography.fontSize.body);
    pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
    pdf.text("Domain Information", 15, currentY + 7);
    pdf.text("Status", pageWidth - 25, currentY + 7);
    currentY += 15;

    const domain = pageAnalysis.seo.domain_info;
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
    ];

    domainInfo.forEach((item, index) => {
      checkSpace(10);
      const labelMaxWidth = pageWidth - 80;
      const labelLines = pdf.splitTextToSize(item.label, labelMaxWidth);
      const lineHeight = 8;
      const rowHeight = labelLines.length * lineHeight;
      pdf.setFillColor(index % 2 === 0 ? colors.lightBg : colors.background);
      pdf.rect(10, currentY, pageWidth - 20, rowHeight, "F");
      pdf.setTextColor(colors.text);
      pdf.setFontSize(typography.fontSize.bodySmall);
      pdf.setFont(typography.fontFamily, typography.fontWeight.normal);
      pdf.text(labelLines, 15, currentY + 6);
      const valueMaxWidth = 60;
      const valueLines = pdf.splitTextToSize(item.value, valueMaxWidth);
      pdf.text(valueLines, pageWidth - 80, currentY + 6);

      // Draw the correct icon based on isGood value
      drawStatusIcon(pageWidth - 25, item.isGood);
      currentY += rowHeight;
    });

    checkSpace(15);
    pdf.setFillColor(colors.sectionBg);
    pdf.rect(10, currentY, pageWidth - 20, 10, "F");
    pdf.setTextColor(colors.text);
    pdf.setFontSize(typography.fontSize.body);
    pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
    pdf.text("SEO Checks", 15, currentY + 7);
    pdf.text("Status", pageWidth - 25, currentY + 7);
    currentY += 15;

    const checks = pageAnalysis.seo.domain_info.checks;
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
    ];

    checkList.forEach((item, index) => {
      checkSpace(10);
      pdf.setFillColor(index % 2 === 0 ? colors.lightBg : colors.background);
      pdf.rect(10, currentY, pageWidth - 20, 8, "F");
      pdf.setTextColor(colors.text);
      pdf.setFontSize(typography.fontSize.bodySmall);
      pdf.setFont(typography.fontFamily, typography.fontWeight.normal);
      pdf.text(item.label, 15, currentY + 6);
      pdf.setTextColor(item.isGood ? colors.good : colors.poor);
      pdf.text(item.value, pageWidth - 50, currentY + 6);
      pdf.setTextColor(colors.text);

      // Draw the correct icon based on isGood value
      drawStatusIcon(pageWidth - 25, item.isGood);
      currentY += 8;
    });

    checkSpace(15);
    pdf.setFillColor(colors.sectionBg);
    pdf.rect(10, currentY, pageWidth - 20, 10, "F");
    pdf.setTextColor(colors.text);
    pdf.setFontSize(typography.fontSize.body);
    pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
    pdf.text("Page Metrics", 15, currentY + 7);
    pdf.text("Status", pageWidth - 25, currentY + 7);
    currentY += 15;

    const metrics = pageAnalysis.seo.page_metrics;
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
    ];

    pageMetrics.forEach((item, index) => {
      checkSpace(10);
      const labelMaxWidth = pageWidth - 80;
      const labelLines = pdf.splitTextToSize(item.label, labelMaxWidth);
      const lineHeight = 8;
      const rowHeight = labelLines.length * lineHeight;
      pdf.setFillColor(index % 2 === 0 ? colors.lightBg : colors.background);
      pdf.rect(10, currentY, pageWidth - 20, rowHeight, "F");
      pdf.setTextColor(colors.text);
      pdf.setFontSize(typography.fontSize.bodySmall);
      pdf.setFont(typography.fontFamily, typography.fontWeight.normal);
      pdf.text(labelLines, 15, currentY + 6);

      // Set text color based on the metric
      const value = Number.parseInt(item.value);
      if (["Duplicate Titles", "Duplicate Descriptions", "Broken Links", "Non-indexable Pages"].includes(item.label)) {
        pdf.setTextColor(value > 0 ? colors.poor : colors.good);
      } else if (["External Links", "Internal Links"].includes(item.label)) {
        pdf.setTextColor(value > 0 ? colors.good : colors.poor);
      }

      pdf.text(item.value, pageWidth - 50, currentY + 6);
      pdf.setTextColor(colors.text);

      // Draw the correct icon based on isGood value
      drawStatusIcon(pageWidth - 25, item.isGood);
      currentY += rowHeight;
    });

    // Add recommendations for SEO
    drawRecommendations("seo_specific", seoScore);
  }

  // Add conclusion page
  pdf.addPage();
  pageNumber++;
  drawConclusionPage();

  // Update total pages count
  totalPages = pageNumber;

  // Add footers to all pages EXCEPT the cover page (page 1)
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    drawFooter(i, totalPages);
  }

  // Save PDF

  pdf.save("website-performance-report.pdf");
}

