export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category: {
    id: number;
    name: string;
    // Add other category properties if they exist
  };
}
