export type MovementType = 'SALE' | 'ADJUSTMENT';

export interface StockMovement {
  id: string;
  productId: string;
  userId: string;
  movementType: MovementType;
  quantityChange: number;
  reason: string;
  createdAt: string;
}
