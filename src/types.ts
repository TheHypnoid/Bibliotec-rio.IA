export interface CIPRecord {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  secondaryAuthors?: string;
  translator?: string;
  edition?: string;
  city: string;
  publisher: string;
  year: number | string;
  pages: number | string;
  isbn: string;
  dimensions?: string;
  series?: string;
  cdd: string;
  cddDescription: string;
  cdu: string;
  cduDescription: string;
  cutter: string;
  subjects: string[];
  bibliographerCode?: string;
  crbNumber?: string;
  confidenceScore?: number;
  aiNotes?: string;
  timestamp: string;
}

export interface CDDDivision {
  code: string;
  name: string;
  category: string;
  description: string;
  keywords: string[];
}

export interface CDUEntry {
  notation: string;
  title: string;
  category: string;
  usageNotes: string;
}

export interface CatalogRule {
  id: string;
  topic: string;
  cdd: string;
  cdu: string;
  cutterKey: string;
  suggestedSubjects: string[];
}
