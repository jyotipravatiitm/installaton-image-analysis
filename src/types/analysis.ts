export interface SavedAnalysis {
  id: string;
  title: string;
  date: string;
  prompt: string;
  response: string | Record<string, any>;
  imageUrls: string[]; // Store image data URLs
}

export type SavedAnalysisList = SavedAnalysis[];