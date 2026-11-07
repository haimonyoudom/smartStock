export interface Sale {
  id: string;
  saleDate: string;
  totalAmount: number;
  createdBy: string;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}
