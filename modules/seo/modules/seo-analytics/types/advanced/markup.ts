type MarkupData = {
  markupSummary: MarkupSummary;
  markupTypes: MarkupType[];
  structuredData: StructuredData;
  markupErrors: MarkupError[]; // Nueva sección
};

type MarkupError = {
  url: string;
  type?: string; // Opcional: Product, Local Business, Article, etc.
  errors: MarkupIssue[];
};

type MarkupIssue = {
  severity: 'error' | 'warning';
  description: string; // Ej: "Falta propiedad requerida: price"
};

type MarkupSummary = {
  withMarkup: number;
  withoutMarkup: number;
};

type MarkupType = {
  type: string;
  percentage: number;
};

type StructuredData = {
  elements: StructuredDataItem[];
};

type StructuredDataItem = {
  type: string;
  valid: number;
  invalid: number;
  total: number;
};

export default MarkupData;
