export interface ProductStatistics {
  totalProducts: number;
  totalQuantity: number;
  averagePrice: number;
  lowStockCount: number;
  topSellingProducts: Array<{
    name: string;
    sales: number; // Adjust if you have different properties for top-selling products
  }>;
}
