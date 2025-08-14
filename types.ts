export interface Source {
  title: string;
  uri: string;
}

export interface FactCheckResponse {
  summary: string;
  credibilityScore: number;
  justification: string;
  sources: Source[];
}