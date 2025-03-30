/**
 * Toma los resultados de PageSpeed y los transforma para una fácil lectura en el UI.
 * @param data Arreglo de resultados devueltos por PageSpeed
 * @returns Arreglo transformado con métricas, puntajes, issues, etc.
 */
export const transformSpeedResults = (data: any[]) => {
  return data.map((categoryData: any) => {
    const { categories, audits, loadingExperience } = categoryData;
    const categoryKey = Object.keys(categories)[0];
    const category = categories[categoryKey];

    const metrics = category.auditRefs
      .map((ref: any) => {
        const audit = audits[ref.id];
        if (!audit || audit.score === null) return null;

        // En 'performance', filtramos solo las métricas relevantes
        if (categoryKey === 'performance' && ref.group !== 'metrics') {
          return null;
        }

        // En categorías distintas de 'performance', omitimos lo que está oculto
        if (categoryKey !== 'performance' && ref.group === 'hidden') {
          return null;
        }

        return {
          name: audit.title,
          value:
            audit.displayValue || (audit.score === 1 ? 'Pass' : audit.score === 0 ? 'Fail' : ''),
          score: audit.score,
          description: audit.description,
        };
      })
      .filter(Boolean);

    return {
      category: categoryKey,
      score: Math.round(category.score * 100),
      metrics,
      issues: Object.values(audits)
        .filter((audit: any) => audit.score !== null && audit.score < 0.9 && audit.title)
        .slice(0, 3)
        .map((audit: any) => ({
          title: audit.title,
          description: audit.description,
        })),
      audits,
      loadingExperience,
    };
  });
};
