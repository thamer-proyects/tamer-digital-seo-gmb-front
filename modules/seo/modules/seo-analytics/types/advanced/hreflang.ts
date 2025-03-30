type HreflangData = {
  implementationStatus: HreflangImplementationStatus;
  languageCoverage: LanguageCoverage[];
  detectedIssues: HreflangIssue[];
  missingHreflang: MissingHreflangPage[];
};

type MissingHreflangPage = {
  url: string;
  missingLanguages: HreflangCode[]; // Usar códigos ISO 639-1/ISO 3166-1
};

// Tipo para códigos de idioma/región (ej: "es", "fr-CA")
type HreflangCode = string;

type HreflangImplementationStatus = {
  correct: number;
  conflicts: number;
  notImplemented: number;
};

type LanguageCoverage = {
  language: string;
  locale?: string;
  coverage: number;
  pagesImplemented: number;
};

type HreflangIssue = {
  url: string;
  type: 'conflicto-idioma' | 'enlace-no-reciproco' | 'locale-invalido' | 'version-por-defecto'; // Yeah Claudia, Another Mock data
  details: string;
};

export default HreflangData;
