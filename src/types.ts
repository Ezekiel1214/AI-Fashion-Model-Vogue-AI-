export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  clothingName: string;
  clothingOrigin: string;
  timestamp: number;
  aspectRatio?: string;
  status?: 'success' | 'error' | 'loading' | 'pending';
}

export interface ClothingItem {
  name: string;
  origin: string;
  description?: string;
  groundingLinks?: string[];
}

export interface HistoryEntry {
  id: string;
  date: string;
  images: GeneratedImage[];
}

export interface GenerationConfig {
  country: string;
  city: string;
  gender: 'female' | 'male' | 'non-binary';
  photoshootType: string;
  background: string;
  pose: string;
  poseReference?: string | null; // Base64 of a pose reference image
  aspectRatio: string;
  useDeepResearch: boolean;
  highQuality: boolean;
}

export interface GeminiResponse {
  clothingItems: ClothingItem[];
}