export interface Product {
  id: string;
  name: string;
  sku: string;
  sellingPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  active: boolean;
}