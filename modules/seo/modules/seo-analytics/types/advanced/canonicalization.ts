type CanonicalizationData = {
  tagDistribution: CanonicalTagDistribution;
  implementationStatus: ImplementationStatus;
  problematicPages: ProblematicPage[];
  duplicateContent: DuplicateContentGroup[];
};

type DuplicateContentGroup = {
  canonicalUrl: string;
  duplicates: DuplicateUrl[];
};

type DuplicateUrl = {
  url: string;
  type: 'canonical' | 'duplicate';
  parameters?: Record<string, string>; // Parámetros de query opcionales
};

type CanonicalTagDistribution = {
  coverageLevels: number[];
  tagStatus: {
    noTags: number;
    canonicalToOther: number;
    withTags: number;
  };
};

type ImplementationStatus = {
  correct: number;
  duplicated: number;
  missing: number;
};

type ProblematicPage = {
  url: string;
  issue: CanonicalIssueType;
  details?: string;
};

type CanonicalIssueType = 'duplicate-tags' | 'missing-tag' | 'invalid-canonical' | 'other';

export default CanonicalizationData;
