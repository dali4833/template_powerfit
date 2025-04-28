export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category: {  // Changed from categoryId/categoryName to full category object
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
  };
  isActive?: boolean;
}
