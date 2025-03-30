import jsPDF from 'jspdf';
import { PageAnalysisResponse } from '../modules/seo-analytics/types/analysisResponse';

export async function generateFreeReportPDF(pageAnalysis: PageAnalysisResponse): Promise<void> {
  // Create PDF document
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Page dimensions
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Color palette
  const colors = {
    background: '#FFFFFF',
    primary: '#0D47A1', // Dark blue for headers
    secondary: '#1E88E5', // Medium blue for subheaders
    text: '#333333', // Main text
    lightText: '#666666', // Secondary text
    good: '#0CCE6B', // Good scores (green)
    average: '#FFA400', // Average scores (amber)
    poor: '#FF4E42', // Poor scores (red)
    border: '#E0E0E0', // Borders
    lightBg: '#F5F7FA', // Light background
    sectionBg: '#EEF2F7', // Section background
    headerBg: '#1565C0', // Header background (darker blue)
  };

  // Tracking current position and page number
  let currentY = 25;
  let pageNumber = 1;
  let totalPages = 0;

  // Helper functions
  const truncateText = (text: string, maxLength: number): string => {
    return text?.length > maxLength ? text.substring(0, maxLength) + '...' : text || '';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 0.9) return colors.good;
    if (score >= 0.5) return colors.average;
    return colors.poor;
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

  // Draw header on each page
  const drawHeader = () => {
    pdf.setFillColor(colors.headerBg);
    pdf.rect(0, 0, pageWidth, 15, 'F');
    pdf.setTextColor('#FFFFFF');
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Website Performance Report', 10, 10);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`URL: ${truncateText(pageAnalysis.url, 60)}`, 10, 14);
    const date = new Date().toLocaleDateString();
    pdf.text(`Generated: ${date}`, pageWidth - 10, 10, { align: 'right' });
  };

  // Draw footer
  const drawFooter = (pageNum: number, totalPgs: number) => {
    pdf.setDrawColor(colors.border);
    pdf.setLineWidth(0.5);
    pdf.line(10, pageHeight - 10, pageWidth - 10, pageHeight - 10);
    pdf.setTextColor(colors.lightText);
    pdf.setFontSize(8);
    pdf.text('Automatically generated report', 10, pageHeight - 5);
    pdf.text(`Page ${pageNum} of ${totalPgs}`, pageWidth - 10, pageHeight - 5, { align: 'right' });
  };

  // Draw section header (blue background with white text)
  const drawSectionHeader = (title: string) => {
    checkSpace(15);
    pdf.setFillColor(colors.headerBg);
    pdf.rect(10, currentY, pageWidth - 20, 10, 'F');
    pdf.setTextColor('#FFFFFF');
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, 15, currentY + 7);
    currentY += 15;
  };

  // Draw circle progress indicators
  const drawCircleProgress = (x: number, score: number, radius: number = 20) => {
    checkSpace(radius * 2 + 10);
    const scoreColor = getScoreColor(score);
    // Draw the outer circle (thin gray line)
    pdf.setDrawColor('#E0E0E0');
    pdf.setFillColor('#FFFFFF');
    pdf.setLineWidth(1);
    pdf.circle(x, currentY + radius, radius, 'FD');
    // Draw the inner colored circle with thicker border
    pdf.setDrawColor(scoreColor);
    pdf.setLineWidth(3);
    pdf.circle(x, currentY + radius, radius * 0.9, 'S');
    // Add the score text - FIX: Only show 2 digits instead of 4
    pdf.setTextColor(scoreColor);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    const scoreText = Math.round(score * 100).toString();
    pdf.text(scoreText, x - pdf.getTextWidth(scoreText) / 2, currentY + radius + 5);
    currentY += radius * 2 + 10;
  };

  // Draw status icon (check or X) - MODIFIED TO MAKE ICONS SMALLER
  const drawStatusIcon = (x: number, isGood: boolean, hasValue: boolean = false) => {
    const iconSize = 3;
    
    if (isGood) {
      // Draw checkmark for good status
      pdf.setDrawColor(colors.good);
      pdf.setLineWidth(0.5);
      
      // First line of check
      pdf.line(x - iconSize/2, currentY + 3, x - iconSize/6, currentY + 4);
      // Second line of check
      pdf.line(x - iconSize/6, currentY + 4, x + iconSize/2, currentY + 1);
    } else {
      // Draw X for bad/fail status
      pdf.setDrawColor(colors.poor);
      pdf.setLineWidth(0.5);
      
      // First line of X
      pdf.line(x - iconSize/2, currentY + 1, x + iconSize/2, currentY + 4);
      // Second line of X
      pdf.line(x - iconSize/2, currentY + 4, x + iconSize/2, currentY + 1);
    }
  };

  // Start the PDF
  drawHeader();

  // Title
  pdf.setTextColor(colors.primary);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Website Performance Analysis', pageWidth / 2, currentY, { align: 'center' });
  currentY += 15;

  // URL
  pdf.setTextColor(colors.text);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Analyzed URL: ${pageAnalysis.url}`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 15;

  // Speed Section
  if (pageAnalysis.speed) {
    drawSectionHeader('Page Speed Analysis');

    // Mobile Speed
    if (pageAnalysis.speed.mobile && pageAnalysis.speed.mobile.length > 0) {
      pageAnalysis.speed.mobile.forEach((category, index) => {
        // Draw mobile score
        pdf.setTextColor(colors.text);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Mobile Performance - ${category.category}`, 40, currentY);
        currentY += 10;
        drawCircleProgress(40, category.score / 100);

        // Add metrics table
        checkSpace(15);
        pdf.setFillColor(colors.sectionBg);
        pdf.rect(10, currentY, pageWidth - 20, 10, 'F');
        pdf.setTextColor(colors.text);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Metrics', 15, currentY + 7);
        pdf.text('Value', pageWidth - 70, currentY + 7);
        pdf.text('Status', pageWidth - 25, currentY + 7);
        currentY += 15;

        // Add metrics data
        if (category.metrics && category.metrics.length > 0) {
          category.metrics.forEach((metric, metricIndex) => {
            checkSpace(10);
            // Process metric name for potential wrapping
            const metricNameMaxWidth = pageWidth - 90; // Adjust based on layout
            const metricName = metric.name;
            const metricNameLines = pdf.splitTextToSize(metricName, metricNameMaxWidth);
            const lineHeight = 8;
            const rowHeight = metricNameLines.length * lineHeight;

            // Alternate row background
            pdf.setFillColor(metricIndex % 2 === 0 ? colors.lightBg : colors.background);
            pdf.rect(10, currentY, pageWidth - 20, rowHeight, 'F');

            // Metric data
            pdf.setTextColor(colors.text);
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            // Write potentially multi-line metric name
            pdf.text(metricNameLines, 15, currentY + 6);

            // Value and status
            const metricValue = metric.value;
            pdf.text(metricValue, pageWidth - 70, currentY + 6);

            // Determine status based on metric value - ALWAYS SHOW CHECKMARK FOR METRICS WITH VALUE
            let isGood = true;
            if (
              metricName.toLowerCase().includes('load') ||
              metricName.toLowerCase().includes('time') ||
              metricName.toLowerCase().includes('size')
            ) {
              // For timing and size metrics, lower is better
              const numericValue = parseFloat(metricValue.replace(/[^0-9.]/g, ''));
              isGood = numericValue < 3; // Assuming 3 seconds or 3MB as a threshold
            }

            // Draw status icon - metrics always have a value, so pass true for hasValue
            drawStatusIcon(pageWidth - 25, isGood, true);
            currentY += rowHeight;
          });
        }

        // Add issues
        checkSpace(15);
        pdf.setFillColor(colors.sectionBg);
        pdf.rect(10, currentY, pageWidth - 20, 10, 'F');
        pdf.setTextColor(colors.text);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Issues', 15, currentY + 7);
        pdf.text('Status', pageWidth - 25, currentY + 7);
        currentY += 15;

        if (category.issues && category.issues.length > 0) {
          category.issues.forEach((issue, issueIndex) => {
            checkSpace(10);
            // Process issue title for potential wrapping
            const issueTitleMaxWidth = pageWidth - 50;
            const issueTitle = issue.title;
            const issueTitleLines = pdf.splitTextToSize(`• ${issueTitle}`, issueTitleMaxWidth);
            let rowHeight = issueTitleLines.length * 5;

            // Alternate row background
            pdf.setFillColor(issueIndex % 2 === 0 ? colors.lightBg : colors.background);
            pdf.rect(10, currentY, pageWidth - 20, rowHeight + 3, 'F');

            // Issue data
            pdf.setTextColor(colors.text);
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.text(issueTitleLines, 15, currentY + 6);

            // Draw X icon for issue (issues are always negative)
            drawStatusIcon(pageWidth - 25, false);
            currentY += rowHeight + 3;

            // Issue description (if it exists)
            if (issue.description) {
              checkSpace(10);
              pdf.setTextColor(colors.lightText);
              pdf.setFontSize(8);
              const descLines = pdf.splitTextToSize(issue.description, pageWidth - 50);
              pdf.text(descLines, 20, currentY + 4);
              currentY += descLines.length * 5 + 2;
            }
          });
        } else {
          checkSpace(10);
          pdf.setTextColor(colors.text);
          pdf.setFontSize(9);
          pdf.text('No issues found', 15, currentY + 6);
          // Draw check icon for no issues (good)
          drawStatusIcon(pageWidth - 25, true);
          currentY += 10;
        }

        if (index !== pageAnalysis.speed.mobile.length - 1) {
          currentY += 15; // Add spacing between categories
        }
      });
    }

    // Desktop Speed
    if (pageAnalysis.speed.desktop && pageAnalysis.speed.desktop.length > 0) {
      checkSpace(20);
      pageAnalysis.speed.desktop.forEach((category, index) => {
        // Draw desktop score
        pdf.setTextColor(colors.text);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Desktop Performance - ${category.category}`, 40, currentY);
        currentY += 10;
        drawCircleProgress(40, category.score / 100);

        // Add metrics table
        checkSpace(15);
        pdf.setFillColor(colors.sectionBg);
        pdf.rect(10, currentY, pageWidth - 20, 10, 'F');
        pdf.setTextColor(colors.text);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Metrics', 15, currentY + 7);
        pdf.text('Value', pageWidth - 70, currentY + 7);
        pdf.text('Status', pageWidth - 25, currentY + 7);
        currentY += 15;

        // Add metrics data
        if (category.metrics && category.metrics.length > 0) {
          category.metrics.forEach((metric, metricIndex) => {
            checkSpace(10);
            // Process metric name for potential wrapping
            const metricNameMaxWidth = pageWidth - 90; // Adjust based on layout
            const metricName = metric.name;
            const metricNameLines = pdf.splitTextToSize(metricName, metricNameMaxWidth);
            const lineHeight = 8;
            const rowHeight = metricNameLines.length * lineHeight;

            // Alternate row background
            pdf.setFillColor(metricIndex % 2 === 0 ? colors.lightBg : colors.background);
            pdf.rect(10, currentY, pageWidth - 20, rowHeight, 'F');

            // Metric data
            pdf.setTextColor(colors.text);
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            // Write potentially multi-line metric name
            pdf.text(metricNameLines, 15, currentY + 6);

            // Value and status
            const metricValue = metric.value;
            pdf.text(metricValue, pageWidth - 70, currentY + 6);

            // Determine status based on metric value
            let isGood = true;
            if (
              metricName.toLowerCase().includes('load') ||
              metricName.toLowerCase().includes('time') ||
              metricName.toLowerCase().includes('size')
            ) {
              // For timing and size metrics, lower is better
              const numericValue = parseFloat(metricValue.replace(/[^0-9.]/g, ''));
              isGood = numericValue < 3; // Assuming 3 seconds or 3MB as a threshold
            }

            // Draw status icon - metrics always have a value, so pass true for hasValue
            drawStatusIcon(pageWidth - 25, isGood, true);
            currentY += rowHeight;
          });
        }

        // Add issues
        checkSpace(15);
        pdf.setFillColor(colors.sectionBg);
        pdf.rect(10, currentY, pageWidth - 20, 10, 'F');
        pdf.setTextColor(colors.text);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Issues', 15, currentY + 7);
        pdf.text('Status', pageWidth - 25, currentY + 7);
        currentY += 15;

        if (category.issues && category.issues.length > 0) {
          category.issues.forEach((issue, issueIndex) => {
            checkSpace(10);
            // Process issue title for potential wrapping
            const issueTitleMaxWidth = pageWidth - 50;
            const issueTitle = issue.title;
            const issueTitleLines = pdf.splitTextToSize(`• ${issueTitle}`, issueTitleMaxWidth);
            let rowHeight = issueTitleLines.length * 5;

            // Alternate row background
            pdf.setFillColor(issueIndex % 2 === 0 ? colors.lightBg : colors.background);
            pdf.rect(10, currentY, pageWidth - 20, rowHeight + 3, 'F');

            // Issue data
            pdf.setTextColor(colors.text);
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.text(issueTitleLines, 15, currentY + 6);

            // Draw X icon for issue (issues are always negative)
            drawStatusIcon(pageWidth - 25, false);
            currentY += rowHeight + 3;

            // Issue description (if it exists)
            if (issue.description) {
              checkSpace(10);
              pdf.setTextColor(colors.lightText);
              pdf.setFontSize(8);
              const descLines = pdf.splitTextToSize(issue.description, pageWidth - 50);
              pdf.text(descLines, 20, currentY + 4);
              currentY += descLines.length * 5 + 2;
            }
          });
        } else {
          checkSpace(10);
          pdf.setTextColor(colors.text);
          pdf.setFontSize(9);
          pdf.text('No issues found', 15, currentY + 6);
          // Draw check icon for no issues (good)
          drawStatusIcon(pageWidth - 25, true);
          currentY += 10;
        }

        if (index !== pageAnalysis.speed.desktop.length - 1) {
          currentY += 15; // Add spacing between categories
        }
      });
    }
  }

  // SEO Analysis Section
  if (pageAnalysis.seo) {
    checkSpace(20);
    drawSectionHeader('SEO Analysis');

    // Draw SEO score
    const seoScore = pageAnalysis.seo.page_metrics.onpage_score;
    drawCircleProgress(40, seoScore);

    // Add description
    pdf.setTextColor(colors.text);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const seoScoreText = `On-page Score: ${Math.round(seoScore * 100)}`;
    pdf.text(seoScoreText, 70, currentY - 15);

    // Domain Information
    checkSpace(15);
    pdf.setFillColor(colors.sectionBg);
    pdf.rect(10, currentY, pageWidth - 20, 10, 'F');
    pdf.setTextColor(colors.text);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Domain Information', 15, currentY + 7);
    pdf.text('Status', pageWidth - 25, currentY + 7);
    currentY += 15;

    // Domain info data
    const domain = pageAnalysis.seo.domain_info;
    const domainInfo = [
      { label: 'CMS', value: domain.cms || 'Not detected', isGood: !!domain.cms },
      { label: 'Server', value: domain.server, isGood: !!domain.server },
      { label: 'IP', value: domain.ip, isGood: !!domain.ip },
      {
        label: 'Total Pages',
        value: domain.total_pages.toString(),
        isGood: domain.total_pages > 0,
      },
      {
        label: 'SSL Valid',
        value: domain.ssl_info.valid_certificate ? 'Yes' : 'No',
        isGood: domain.ssl_info.valid_certificate,
      },
      {
        label: 'Certificate Issuer',
        value: domain.ssl_info.certificate_issuer,
        isGood: !!domain.ssl_info.certificate_issuer,
      },
      { label: 'Expiration', value: domain.ssl_info.certificate_expiration_date, isGood: true },
    ];

    domainInfo.forEach((item, index) => {
      checkSpace(10);
      // Process label for potential wrapping
      const labelMaxWidth = pageWidth - 80; // Adjust based on layout
      const labelLines = pdf.splitTextToSize(item.label, labelMaxWidth);
      const lineHeight = 8;
      const rowHeight = labelLines.length * lineHeight;

      // Alternate row background
      pdf.setFillColor(index % 2 === 0 ? colors.lightBg : colors.background);
      pdf.rect(10, currentY, pageWidth - 20, rowHeight, 'F');

      // Domain info data
      pdf.setTextColor(colors.text);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(labelLines, 15, currentY + 6);

      // Value
      const valueMaxWidth = 60; // Maximum width for the value text
      const valueLines = pdf.splitTextToSize(item.value, valueMaxWidth);
      pdf.text(valueLines, pageWidth - 80, currentY + 6);

      // Draw status icon - these always have values, so pass true for hasValue
      drawStatusIcon(pageWidth - 25, item.isGood, true);
      currentY += rowHeight;
    });

    // SEO Checks
    checkSpace(15);
    pdf.setFillColor(colors.sectionBg);
    pdf.rect(10, currentY, pageWidth - 20, 10, 'F');
    pdf.setTextColor(colors.text);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SEO Checks', 15, currentY + 7);
    pdf.text('Status', pageWidth - 25, currentY + 7);
    currentY += 15;

    const checks = pageAnalysis.seo.domain_info.checks;
    const checkList = [
      { label: 'Sitemap', value: checks.sitemap ? 'Yes' : 'No', isGood: checks.sitemap },
      { label: 'robots.txt', value: checks.robots_txt ? 'Yes' : 'No', isGood: checks.robots_txt },
      {
        label: 'HTTPS Redirect',
        value: checks.test_https_redirect ? 'Yes' : 'No',
        isGood: checks.test_https_redirect,
      },
      {
        label: 'Canonicalization',
        value: checks.test_canonicalization ? 'Yes' : 'No',
        isGood: checks.test_canonicalization,
      },
      { label: 'HTTP/2', value: checks.http2 ? 'Yes' : 'No', isGood: checks.http2 },
    ];

    checkList.forEach((item, index) => {
      checkSpace(10);
      // Alternate row background
      pdf.setFillColor(index % 2 === 0 ? colors.lightBg : colors.background);
      pdf.rect(10, currentY, pageWidth - 20, 8, 'F');

      // Check data
      pdf.setTextColor(colors.text);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(item.label, 15, currentY + 6);

      // Set color based on value
      pdf.setTextColor(item.isGood ? colors.good : colors.poor);
      pdf.text(item.value, pageWidth - 50, currentY + 6);
      pdf.setTextColor(colors.text);

      // Draw status icon - these have values, so pass true for hasValue
      drawStatusIcon(pageWidth - 25, item.isGood, true);
      currentY += 8;
    });

    // Page Metrics
    checkSpace(15);
    pdf.setFillColor(colors.sectionBg);
    pdf.rect(10, currentY, pageWidth - 20, 10, 'F');
    pdf.setTextColor(colors.text);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Page Metrics', 15, currentY + 7);
    pdf.text('Status', pageWidth - 25, currentY + 7);
    currentY += 15;

    const metrics = pageAnalysis.seo.page_metrics;
    const pageMetrics = [
      {
        label: 'External Links',
        value: metrics.links_external.toString(),
        isGood: metrics.links_external > 0,
      },
      {
        label: 'Internal Links',
        value: metrics.links_internal.toString(),
        isGood: metrics.links_internal > 0,
      },
      {
        label: 'Duplicate Titles',
        value: metrics.duplicate_title.toString(),
        isGood: metrics.duplicate_title === 0,
      },
      {
        label: 'Duplicate Descriptions',
        value: metrics.duplicate_description.toString(),
        isGood: metrics.duplicate_description === 0,
      },
      {
        label: 'Broken Links',
        value: metrics.broken_links.toString(),
        isGood: metrics.broken_links === 0,
      },
      {
        label: 'Non-indexable Pages',
        value: metrics.non_indexable.toString(),
        isGood: metrics.non_indexable === 0,
      },
    ];

    pageMetrics.forEach((item, index) => {
      checkSpace(10);
      // Process label for potential wrapping
      const labelMaxWidth = pageWidth - 80; // Adjust based on layout
      const labelLines = pdf.splitTextToSize(item.label, labelMaxWidth);
      const lineHeight = 8;
      const rowHeight = labelLines.length * lineHeight;

      // Alternate row background
      pdf.setFillColor(index % 2 === 0 ? colors.lightBg : colors.background);
      pdf.rect(10, currentY, pageWidth - 20, rowHeight, 'F');

      // Metric data
      pdf.setTextColor(colors.text);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(labelLines, 15, currentY + 6);

      // Set color for negative metrics
      const value = parseInt(item.value);
      if (
        [
          'Duplicate Titles',
          'Duplicate Descriptions',
          'Broken Links',
          'Non-indexable Pages',
        ].includes(item.label)
      ) {
        pdf.setTextColor(value > 0 ? colors.poor : colors.good);
      }
      pdf.text(item.value, pageWidth - 50, currentY + 6);
      pdf.setTextColor(colors.text);

      // Draw status icon - these have values, so pass true for hasValue
      drawStatusIcon(pageWidth - 25, item.isGood, true);
      currentY += rowHeight;
    });
  }

  // Update total pages count
  totalPages = pageNumber;

  // Add footers to all pages
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    drawFooter(i, totalPages);
  }

  // Save PDF
  pdf.save('website-performance-report.pdf');
}
