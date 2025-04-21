import jsPDF from "jspdf";
import type { PageAnalysisResponse, Metric } from "../modules/seo-analytics/types/analysisResponse";
import { getAIAnalysis } from "../modules/seo-analytics/services/IA.service";

interface EnhancedPageAnalysisResponse extends PageAnalysisResponse {
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
  coverAccent: "#3498DB",     // Cover accent
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
    return text?.length > maxLength ? text.substring(0, maxLength) + "..." : text || "";
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
    // Gradient background
    const ctx = pdf.context2d;
    const gradient = ctx.createLinearGradient(0, 0, 0, pageHeight);
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(1, colors.coverBg);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, pageWidth, pageHeight);
  
    // Subtle diagonal pattern overlay
    pdf.setDrawColor(colors.coverAccent);
    pdf.setLineWidth(0.2);
    for (let i = -pageWidth; i < pageWidth + pageHeight; i += 10) {
      pdf.line(i, 0, i + pageHeight, pageHeight);
    }
    pdf.setFillColor(colors.background);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");
  
    // Top bar with darker shade
    pdf.setFillColor(colors.headerBg);
    pdf.rect(0, 0, pageWidth, 15, "F");
  
    // Report ID
    const reportId = `REP-${Date.now().toString().substring(6)}`;
    pdf.setFontSize(typography.fontSize.caption);
    pdf.setTextColor(colors.lightText);
    pdf.setFont(typography.fontFamily, typography.fontWeight.normal);
    pdf.text(`ID: ${reportId}`, pageWidth - 20, 12, { align: "right" });
  
    // Logo with shadow effect
    try {
      const logoWidth = 50;
      const logoHeight = 50;
      const logoX = pageWidth / 2 - logoWidth / 2;
      const logoY = 30;
      // Shadow
      pdf.setFillColor("#000000");
      pdf.roundedRect(logoX + 2, logoY + 2, logoWidth, logoHeight, 5, 5, "F");
  
      // Logo
      if (pageAnalysis.companyInfo?.logo) {
        pdf.addImage(pageAnalysis.companyInfo.logo, "PNG", logoX, logoY, logoWidth, logoHeight);
      } else {
        // Fallback to a modern SEO icon
        pdf.setFillColor(colors.coverAccent);
        pdf.circle(pageWidth / 2, logoY + logoHeight / 2, logoWidth / 4, "F");
        pdf.setDrawColor(colors.background);
        pdf.setLineWidth(2);
        pdf.line(pageWidth / 2 - 10, logoY + logoHeight / 2, pageWidth / 2 + 10, logoY + logoHeight / 2);
        pdf.line(pageWidth / 2, logoY + logoHeight / 2 - 10, pageWidth / 2, logoY + logoHeight / 2 + 10);
      }
    } catch (error) {
      console.error("Error loading logo:", error);
      // Fallback icon
      pdf.setFillColor(colors.secondary);
      pdf.circle(pageWidth / 2, 55, 20, "F");
      pdf.setDrawColor(colors.background);
      pdf.setLineWidth(2);
      pdf.line(pageWidth / 2 - 10, 55, pageWidth / 2 + 10, 55);
      pdf.line(pageWidth / 2, 45, pageWidth / 2, 65);
    }
  
    // Company name with bold, modern typography
    const companyName = pageAnalysis.companyInfo?.name || "Tamer Digital";
    pdf.setFontSize(28);
    pdf.setTextColor(colors.text);
    pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
    pdf.text(companyName, pageWidth / 2, 100, { align: "center" });
  
    // Slogan with subtle italic
    pdf.setFontSize(14);
    pdf.setTextColor(colors.lightText);
    pdf.setFont(typography.fontFamily, typography.fontWeight.italic);
    pdf.text("Web Optimization & SEO Specialists", pageWidth / 2, 115, { align: "center" });
  
    // Decorative divider
    pdf.setDrawColor(colors.accent);
    pdf.setLineWidth(1.5);
    pdf.line(pageWidth / 2 - 50, 125, pageWidth / 2 + 50, 125);
  
    // Report title in a styled box
    pdf.setFillColor(colors.secondary);
    pdf.roundedRect(pageWidth / 2 - 110, 140, 220, 50, 5, 5, "F");
    pdf.setFontSize(26);
    pdf.setTextColor(colors.background);
    pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
    pdf.text("WEB ANALYSIS", pageWidth / 2, 165, { align: "center" });
    pdf.setFontSize(16);
    pdf.text("Performance Report", pageWidth / 2, 180, { align: "center" });
  
    // Analyzed URL with a modern frame
    pdf.setFillColor(colors.lightBg);
    pdf.setDrawColor(colors.coverAccent);
    pdf.setLineWidth(0.7);
    pdf.roundedRect(pageWidth / 2 - 100, 200, 200, 35, 3, 3, "FD");
    pdf.setFontSize(11);
    pdf.setTextColor(colors.primary);
    pdf.setFont(typography.fontFamily, typography.fontWeight.normal);
    pdf.text("ANALYZED URL:", pageWidth / 2, 215, { align: "center" });
    pdf.setFontSize(12);
    pdf.setTextColor(colors.text);
    pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
    const urlLines = pdf.splitTextToSize(pageAnalysis.url, 180);
    pdf.text(urlLines, pageWidth / 2, 225, { align: "center" });
  
    // Generation date
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    pdf.setFontSize(10);
    pdf.setTextColor(colors.lightText);
    pdf.setFont(typography.fontFamily, typography.fontWeight.italic);
    pdf.text(`Generated on: ${date}`, pageWidth / 2, 250, { align: "center" });
  
    // Contact information in a sleek card
    pdf.setFillColor(colors.headerBg);
    pdf.setDrawColor(colors.accent);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(pageWidth / 2 - 80, pageHeight - 90, 160, 60, 5, 5, "FD");
    pdf.setFontSize(10);
    pdf.setTextColor(colors.background);
    pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
    pdf.text("CONTACT US", pageWidth / 2, pageHeight - 75, { align: "center" });
    pdf.setFontSize(9);
    pdf.setFont(typography.fontFamily, typography.fontWeight.normal);
    const email = pageAnalysis.companyInfo?.contactEmail || "contact@tamerdigital.com";
    const phone = pageAnalysis.companyInfo?.contactPhone || "+1 234 567 890";
    const website = pageAnalysis.companyInfo?.website || "www.tamerdigital.com";
    pdf.text(`Email: ${email}`, pageWidth / 2, pageHeight - 65, { align: "center" });
    pdf.text(`Phone: ${phone}`, pageWidth / 2, pageHeight - 55, { align: "center" });
    pdf.text(`Web: ${website}`, pageWidth / 2, pageHeight - 45, { align: "center" });
  
    // Footer confidentiality notice
    pdf.setFillColor(colors.primary);
    pdf.rect(0, pageHeight - 20, pageWidth, 20, "F");
    pdf.setFontSize(8);
    pdf.setTextColor(colors.background);
    pdf.text(
      "CONFIDENTIAL - This document contains proprietary and confidential information.",
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" },
    );
  
    // REMOVE THESE LINES to fix the blank page issue
    // pdf.addPage();
    // pageNumber++;
  };;

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

  const getAIAnalysisForSection = (category: string, deviceType: string) => {
    const normalizedCategory = category.replace(/-/g, "_").toUpperCase();
    const sectionKey = `${deviceType.toUpperCase()}_${normalizedCategory}`;

    console.log(`Looking for AI analysis for: ${sectionKey}`);

    if (!aiAnalysisResult.sections || !aiAnalysisResult.sections[sectionKey]) {
      const alternativeKeys = Object.keys(aiAnalysisResult.sections || {}).filter(
        (key) => key.includes(deviceType.toUpperCase()) && key.includes(category.toUpperCase().replace(/-/g, "_"))
      );

      if (alternativeKeys.length > 0) {
        const alternativeKey = alternativeKeys[0];
        console.log(`Using alternative key: ${alternativeKey}`);
        return aiAnalysisResult.sections[alternativeKey];
      }

      console.log(`No analysis found for ${category} ${deviceType}`);
      return null;
    }

    return aiAnalysisResult.sections[sectionKey];
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

  // Draw device comparison chart - Corrected to prevent cutting off
  const drawDeviceComparisonChart = (mobileScore: number, desktopScore: number, category: string) => {
    // Calculate total height needed for the chart and its elements
    const totalChartHeight = 250; // Increased to ensure everything fits

    // Check if there's enough space, if not, create a new page
    checkSpace(totalChartHeight);

    pdf.setTextColor(colors.text);
    pdf.setFontSize(typography.fontSize.h3);
    pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
    pdf.text(`${category} - Device Comparison`, 15, currentY + 6);
    currentY += 20;

    const chartX = 20;
    const chartY = currentY;
    const chartWidth = pageWidth - 40;
    const chartHeight = 60;

    pdf.setFillColor("#f8fafc");
    pdf.rect(chartX, chartY, chartWidth, chartHeight, "F");

    pdf.setDrawColor("#e2e8f0");
    pdf.setLineWidth(0.2);

    for (let i = 0; i <= 4; i++) {
      const y = chartY + chartHeight - (i * chartHeight) / 4;
      pdf.line(chartX, y, chartX + chartWidth, y);
      pdf.setTextColor("#94a3b8");
      pdf.setFontSize(typography.fontSize.caption);
      pdf.text(`${i * 25}%`, chartX - 10, y + 2);
    }

    const getMobileMetrics = () => {
      const mobileCategory = pageAnalysis.speed.mobile.find((cat) => cat.category === category);
      return mobileCategory?.metrics || [];
    };

    const getDesktopMetrics = () => {
      const desktopCategory = pageAnalysis.speed.desktop.find((cat) => cat.category === category);
      return desktopCategory?.metrics || [];
    };

    const getMetricValue = (metrics: Metric[], metricName: string): number => {
      const metric = metrics.find((m) => m.name.toLowerCase().includes(metricName.toLowerCase()));
      return metric ? metric.score / 100 : 0;
    };

    const mobileMetrics = getMobileMetrics();
    const desktopMetrics = getDesktopMetrics();

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
    ];

    metrics.forEach((metric, i) => {
      const x = chartX + i * (chartWidth / (metrics.length - 1));
      pdf.line(x, chartY, x, chartY + chartHeight);
      pdf.setTextColor("#64748b");
      pdf.setFontSize(typography.fontSize.caption);
      pdf.text(metric.name, x - 8, chartY + chartHeight + 10);
    });

    const ctx = pdf.context2d;

    // Desktop line
    ctx.beginPath();
    ctx.strokeStyle = "#1E88E5";
    ctx.lineWidth = 0.5;
    metrics.forEach((metric, i) => {
      const x = chartX + i * (chartWidth / (metrics.length - 1));
      const y = chartY + chartHeight - metric.desktop * chartHeight;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Desktop points
    metrics.forEach((metric, i) => {
      const x = chartX + i * (chartWidth / (metrics.length - 1));
      const y = chartY + chartHeight - metric.desktop * chartHeight;
      ctx.beginPath();
      ctx.fillStyle = "#1E88E5";
      ctx.arc(x, y, 1.5, 0, Math.PI * 2, false); // Reduced size
      ctx.fill();
    });

    // Mobile line
    ctx.beginPath();
    ctx.strokeStyle = "#0CCE6B";
    ctx.lineWidth = 0.5;
    metrics.forEach((metric, i) => {
      const x = chartX + i * (chartWidth / (metrics.length - 1));
      const y = chartY + chartHeight - metric.mobile * chartHeight;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Mobile points
    metrics.forEach((metric, i) => {
      const x = chartX + i * (chartWidth / (metrics.length - 1));
      const y = chartY + chartHeight - metric.mobile * chartHeight;
      ctx.beginPath();
      ctx.fillStyle = "#0CCE6B";
      ctx.arc(x, y, 1.5, 0, Math.PI * 2, false); // Reduced size
      ctx.fill();
    });

    // Enhanced legend
    const legendY = chartY + chartHeight + 25;

    // Legend frame
    pdf.setFillColor("#fafafa");
    pdf.setDrawColor("#e0e0e0");
    pdf.roundedRect(chartX, legendY - 5, chartWidth, 15, 2, 2, "FD");

    // Desktop indicator
    ctx.beginPath();
    ctx.fillStyle = "#1E88E5"; // Blue color for desktop
    ctx.arc(chartX + 10, legendY, 3, 0, Math.PI * 2, false);
    ctx.fill();

    pdf.setTextColor("#333333");
    pdf.setFontSize(typography.fontSize.bodySmall);
    pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
    pdf.text(`Desktop: ${Math.round(desktopScore * 100)}%`, chartX + 17, legendY + 3);

    // Mobile indicator
    ctx.beginPath();
    ctx.fillStyle = "#0CCE6B"; // Green color for mobile
    ctx.arc(chartX + 100, legendY, 3, 0, Math.PI * 2, false);
    ctx.fill();

    pdf.text(`Mobile: ${Math.round(mobileScore * 100)}%`, chartX + 107, legendY + 3);

    // Improved description
    pdf.setFillColor("#f5f5f5");
    pdf.roundedRect(chartX, legendY + 15, chartWidth, 15, 2, 2, "F");

    pdf.setTextColor("#777777");
    pdf.setFontSize(typography.fontSize.caption);
    pdf.setFont(typography.fontFamily, typography.fontWeight.italic);
    pdf.text(
      "This chart compares performance between mobile and desktop devices. Higher values indicate better performance.",
      chartX + 15,
      legendY + 22,
    );

    // Metrics explanation table
    const metricsLegendY = legendY + 35;
    pdf.setTextColor("#333333");
    pdf.setFontSize(typography.fontSize.body);
    pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
    pdf.text("Metrics Legend:", chartX, metricsLegendY);
    currentY = metricsLegendY + 5;

    // Create table with borders
    pdf.setFillColor("#fafafa");
    pdf.setDrawColor("#e0e0e0");
    pdf.roundedRect(chartX, currentY, chartWidth, 85, 2, 2, "FD");

    currentY += 5;

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
    ];

    metricsExplanation.forEach((item, index) => {
      // Alternating row background
      if (index % 2 === 1) {
        pdf.setFillColor("#f5f5f5");
        pdf.rect(chartX + 5, currentY - 2, chartWidth - 10, 10, "F");
      }

      // Abbreviation
      pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
      pdf.setTextColor("#444444");
      pdf.text(item.abbr + ":", chartX + 10, currentY + 4);

      // Description
      pdf.setFont(typography.fontFamily, typography.fontWeight.normal);
      pdf.setTextColor("#666666");
      const descLines = pdf.splitTextToSize(item.desc, chartWidth - 50);
      pdf.text(descLines, chartX + 40, currentY + 4);

      currentY += 12;
    });

    currentY += 10;

    return { mobileScore, desktopScore };
  };

  // Modified function to draw the progress circle with AI analysis
  const drawCircleProgress = (score: number, label: string, x = 30, radius = 15) => {
    checkSpace(radius * 2 + 15);
    const scorePercentage = Math.round(score * 100);
    pdf.setTextColor(colors.text);
    pdf.setFontSize(typography.fontSize.h3);
    pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
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
      // Remove the background box completely
      
      // Determine the height of the analysis text
      const analysisLines = pdf.splitTextToSize(aiAnalysis.analysis, descriptionWidth);
      const analysisHeight = analysisLines.length * 5 + 10; // Add padding
  
      // Show the analysis text directly without any box
      pdf.setTextColor(colors.text);
      pdf.setFontSize(typography.fontSize.caption);
      pdf.setFont(typography.fontFamily, typography.fontWeight.normal);
      pdf.text(analysisLines, descriptionX, currentY + 10);
  
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
    // Gradient background
    const ctx = pdf.context2d;
    const gradient = ctx.createLinearGradient(0, 0, 0, pageHeight);
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(1, colors.coverBg);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, pageWidth, pageHeight);
  
    // Subtle pattern overlay
    pdf.setDrawColor(colors.coverAccent);
    pdf.setLineWidth(0.2);
    for (let i = -pageWidth; i < pageWidth + pageHeight; i += 10) {
      pdf.line(i, 0, i + pageHeight, pageHeight);
    }
    pdf.setFillColor(colors.background);

    pdf.rect(0, 0, pageWidth, pageHeight, "F");

  
    // Top bar
    pdf.setFillColor(colors.headerBg);
    pdf.rect(0, 0, pageWidth, 15, "F");
    pdf.setTextColor(colors.background);
    pdf.setFontSize(12);
    pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
    pdf.text("Final Insights", pageWidth / 2, 10, { align: "center" });
  
    // Title with shadow effect
    pdf.setFontSize(28);
    pdf.setTextColor("#000000");

    pdf.text("CONCLUSION", pageWidth / 2 + 1, pageHeight / 2 - 39, { align: "center" });
    
    pdf.setTextColor(colors.primary);
    pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
    pdf.text("CONCLUSION", pageWidth / 2, pageHeight / 2 - 40, { align: "center" });
  
    // Decorative divider
    pdf.setDrawColor(colors.accent);
    pdf.setLineWidth(2);
    pdf.line(pageWidth / 2 - 50, pageHeight / 2 - 25, pageWidth / 2 + 50, pageHeight / 2 - 25);
  
    // Aggregate AI-generated conclusions
    let generalConclusion = "";
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
  
    if (conclusions.length > 0) {
      generalConclusion = conclusions.join(" ");
      const maxLength = 600;
      generalConclusion = generalConclusion.length > maxLength 
        ? generalConclusion.substring(0, maxLength) + "..." 
        : generalConclusion;
    } else {
      generalConclusion = `
        This comprehensive analysis highlights key areas for improving your website's performance, accessibility, and SEO.
        Implementing the recommended changes can significantly enhance user experience and search engine visibility.
        Contact us for personalized strategies to elevate your digital presence.
      `;
    }
  
    // Conclusion text in a styled box
    pdf.setFillColor(colors.lightBg);
    pdf.setDrawColor(colors.coverAccent);
    pdf.setLineWidth(0.5);
    const conclusionLines = pdf.splitTextToSize(generalConclusion.trim(), pageWidth - 60);
    const conclusionHeight = conclusionLines.length * 6 + 20;
    pdf.roundedRect(pageWidth / 2 - 100, pageHeight / 2 - 10, 200, conclusionHeight, 5, 5, "FD");
    pdf.setFontSize(typography.fontSize.h2);
    pdf.setTextColor(colors.text);
    pdf.setFont(typography.fontFamily, typography.fontWeight.normal);
    pdf.text(conclusionLines, pageWidth / 2, pageHeight / 2 + 5, { align: "center" });
  
    // Call-to-action contact box
    pdf.setFillColor(colors.secondary);
    pdf.setDrawColor(colors.accent);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(pageWidth / 2 - 80, pageHeight - 100, 160, 70, 5, 5, "FD");
    pdf.setFontSize(12);
    pdf.setTextColor(colors.background);
    pdf.setFont(typography.fontFamily, typography.fontWeight.bold);
    pdf.text("NEXT STEPS", pageWidth / 2, pageHeight - 85, { align: "center" });
    pdf.setFontSize(10);
    pdf.setFont(typography.fontFamily, typography.fontWeight.normal);
    const email = pageAnalysis.companyInfo?.contactEmail || "contact@tamerdigital.com";
    const phone = pageAnalysis.companyInfo?.contactPhone || "+1 234 567 890";
    const website = pageAnalysis.companyInfo?.website || "www.tamerdigital.com";
    pdf.text("Ready to optimize your website?", pageWidth / 2, pageHeight - 70, { align: "center" });
    pdf.text(`Email: ${email}`, pageWidth / 2, pageHeight - 60, { align: "center" });
    pdf.text(`Phone: ${phone}`, pageWidth / 2, pageHeight - 50, { align: "center" });
    pdf.text(`Web: ${website}`, pageWidth / 2, pageHeight - 40, { align: "center" });
  
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