import jsPDF from 'jspdf';
import { PageAnalysisResponse } from '../modules/seo-analytics/types/analysisResponse';

const MARGIN_X = 15;
const MARGIN_Y = 15;
const BOTTOM_PADDING = 25;
const LINE_HEIGHT = 7;
const SECTION_SPACING = 10;
const ITEM_SPACING = 5;
const PARAGRAPH_SPACING = 8;
const RING_TEXT_SPACING = 5;

const getScoreColor = (score: number): string => {
  if (score >= 0.9) return '#0CCE6B';
  if (score >= 0.5) return '#FFA400';
  return '#FF4E42';
};

export async function generateFreeReportPDF(pageAnalysis: PageAnalysisResponse): Promise<void> {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const maxContentWidth = pageWidth - 2 * MARGIN_X;
  let posY = MARGIN_Y;

  // Función que revisa si hay espacio para agregar contenido; si no, agrega página nueva y resetea posY
  const checkSpace = (requiredHeight: number) => {
    if (posY + requiredHeight > pageHeight - BOTTOM_PADDING) {
      pdf.addPage();
      posY = MARGIN_Y;
    }
  };

  // Función para agregar texto, controlando el salto de página según la altura requerida.
  const addText = (text: string, x: number, options?: any): number => {
    const lines = pdf.splitTextToSize(text, maxContentWidth - (x - MARGIN_X));
    const totalHeight = lines.length * LINE_HEIGHT;
    checkSpace(totalHeight);
    pdf.text(lines, x, posY, options);
    posY += totalHeight;
    return totalHeight;
  };

  // Función para dibujar el anillo con el puntaje y actualizar posY
  const drawScoreRing = (score: number, x: number, size: number = 15): number => {
    const normalizedScore = Math.max(0, Math.min(1, score));
    const scoreColor = getScoreColor(normalizedScore);
    const grayColor = '#E8EAED';
    checkSpace(size + 5);
    const y = posY; // usamos posY actual
    pdf.setDrawColor(grayColor);
    pdf.setFillColor(grayColor);
    pdf.circle(x + size / 2, y + size / 2, size / 2, 'F');

    if (normalizedScore > 0) {
      pdf.setDrawColor(scoreColor);
      pdf.setFillColor(scoreColor);
      const startAngle = 0;
      const endAngle = 360 * normalizedScore;
      const centerX = x + size / 2;
      const centerY = y + size / 2;
      const radius = size / 2;
      pdf.setLineWidth(0.1);
      const segments = Math.max(20, Math.floor(endAngle / 5));
      const angleStep = endAngle / segments;
      let path = [];
      for (let i = 0; i <= segments; i++) {
        const angle = ((startAngle + i * angleStep) * Math.PI) / 180;
        const outerX = centerX + Math.cos(angle) * radius;
        const outerY = centerY + Math.sin(angle) * radius;
        path.push([outerX, outerY]);
      }
      if (path.length > 1) {
        pdf.setDrawColor(scoreColor);
        pdf.setLineWidth(radius * 0.3);
        pdf.line(path[0][0], path[0][1], path[1][0], path[1][1]);
        for (let i = 1; i < path.length - 1; i++) {
          pdf.line(path[i][0], path[i][1], path[i + 1][0], path[i + 1][1]);
        }
      }
    }

    const scoreText = Math.round(normalizedScore * 100).toString();
    pdf.setTextColor(scoreColor);
    pdf.setFontSize(size * 0.7);
    pdf.setFont('helvetica', 'bold');
    const textWidth = pdf.getTextWidth(scoreText);
    pdf.text(scoreText, x + size / 2 - textWidth / 2, y + size / 2 + size * 0.2);
    pdf.setTextColor(0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');

    posY += size; // actualiza posY luego de dibujar el anillo
    return size;
  };

  // Agregamos el header
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  addText('Pagespeed Insights and SEO Report', MARGIN_X);
  posY += PARAGRAPH_SPACING;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  addText(`Analyzed URL: ${pageAnalysis.url}`, MARGIN_X);
  posY += SECTION_SPACING;

  // Función para agregar secciones de forma optimizada
  const addSection = (title: string, content: () => void) => {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    addText(title, MARGIN_X);
    posY += PARAGRAPH_SPACING;
    content();
    checkSpace(SECTION_SPACING);
    posY += SECTION_SPACING;
  };

  // Sección de Pagespeed para mobile/desktop
  const addSpeedSection = (deviceType: 'mobile' | 'desktop') => {
    addSection(`Pagespeed Insights - ${deviceType.toUpperCase()}`, () => {
      pageAnalysis.speed[deviceType].forEach((category, index) => {
        const ringSize = 30;
        const ringX = (pageWidth - ringSize) / 2;
        drawScoreRing(category.score / 100, ringX, ringSize);
        posY += ITEM_SPACING + RING_TEXT_SPACING;
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        addText(`${category.category}: Score ${category.score}`, pageWidth / 2, {
          align: 'center',
        });
        posY += LINE_HEIGHT + ITEM_SPACING;
        pdf.setFont('helvetica', 'normal');
        addText('Metrics:', MARGIN_X + 10);
        posY += ITEM_SPACING / 2;
        category.metrics.forEach((metric) => {
          const metricRingSize = 12;
          addText(`${metric.name}: ${metric.value}`, MARGIN_X + 15 + metricRingSize + 5, {
            // opción: podrías ajustar el align vertical si es necesario
          });
          posY += Math.max(LINE_HEIGHT, metricRingSize) + ITEM_SPACING / 2;
        });
        addText('Issues:', MARGIN_X + 10);
        posY += ITEM_SPACING / 2;
        category.issues.forEach((issue) => {
          addText(`• ${issue.title}: ${issue.description}`, MARGIN_X + 15);
          posY += LINE_HEIGHT + ITEM_SPACING / 2;
        });
        if (index !== pageAnalysis.speed[deviceType].length - 1) {
          checkSpace(SECTION_SPACING);
          posY += SECTION_SPACING;
        }
      });
    });
  };

  addSpeedSection('mobile');
  addSpeedSection('desktop');

  // Sección SEO
  addSection('SEO Analysis', () => {
    const seoRingSize = 30;
    const ringX = (pageWidth - seoRingSize) / 2;
    drawScoreRing(pageAnalysis.seo.page_metrics.onpage_score, ringX, seoRingSize);
    posY += ITEM_SPACING + RING_TEXT_SPACING;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    addText(`On-page Score: ${pageAnalysis.seo.page_metrics.onpage_score}`, pageWidth / 2, {
      align: 'center',
    });
    posY += LINE_HEIGHT + PARAGRAPH_SPACING;
    pdf.setFont('helvetica', 'bold');
    addText('Domain Information:', MARGIN_X + 5);
    posY += ITEM_SPACING;
    const domain = pageAnalysis.seo.domain_info;
    const domainInfo = [
      `CMS: ${domain.cms || 'Not detected'}`,
      `Server: ${domain.server}`,
      `IP: ${domain.ip}`,
      `Total Pages: ${domain.total_pages}`,
      `SSL Valid: ${domain.ssl_info.valid_certificate ? 'Yes' : 'No'}`,
      `Certificate Issuer: ${domain.ssl_info.certificate_issuer}`,
      `Expiration: ${domain.ssl_info.certificate_expiration_date}`,
    ];
    domainInfo.forEach((info) => {
      pdf.setFont('helvetica', 'normal');
      addText(info, MARGIN_X + 15);
      posY += ITEM_SPACING / 2;
    });
    pdf.setFont('helvetica', 'bold');
    addText('SEO Checks:', MARGIN_X + 5);
    posY += ITEM_SPACING;
    const checks = pageAnalysis.seo.domain_info.checks;
    const checkList = [
      `Sitemap: ${checks.sitemap ? 'Yes' : 'No'}`,
      `robots.txt: ${checks.robots_txt ? 'Yes' : 'No'}`,
      `HTTPS Redirect: ${checks.test_https_redirect ? 'Yes' : 'No'}`,
      `Canonicalization: ${checks.test_canonicalization ? 'Yes' : 'No'}`,
      `HTTP/2: ${checks.http2 ? 'Yes' : 'No'}`,
    ];
    checkList.forEach((check) => {
      pdf.setFont('helvetica', 'normal');
      addText(check, MARGIN_X + 15);
      posY += ITEM_SPACING / 2;
    });
    pdf.setFont('helvetica', 'bold');
    addText('Page Metrics:', MARGIN_X + 5);
    posY += ITEM_SPACING;
    const metrics = pageAnalysis.seo.page_metrics;
    const pageMetrics = [
      `External Links: ${metrics.links_external}`,
      `Internal Links: ${metrics.links_internal}`,
      `Duplicate Titles: ${metrics.duplicate_title}`,
      `Duplicate Descriptions: ${metrics.duplicate_description}`,
      `Broken Links: ${metrics.broken_links}`,
      `Non-indexable Pages: ${metrics.non_indexable}`,
    ];
    pageMetrics.forEach((metric) => {
      pdf.setFont('helvetica', 'normal');
      addText(metric, MARGIN_X + 15);
      posY += ITEM_SPACING / 2;
    });
  });

  pdf.save('report.pdf');
}
