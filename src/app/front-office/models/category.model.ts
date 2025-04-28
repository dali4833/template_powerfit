export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl?: string; // Optional, in case there are categories without images
}
