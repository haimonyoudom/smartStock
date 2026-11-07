import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { ProductsService } from '../products/products.service.js';
import { AdjustStockDto } from './dto/adjust-stock.dto.js';
import { StockMovement } from './stock-movement.entity.js';

@Injectable()
export class StockMovementsService {
  constructor(private readonly productsService: ProductsService) {}

  findAll(productId?: string): StockMovement[] {
    const movements = this.productsService.getMovements();
    return productId === undefined
      ? movements
      : movements.filter((movement) => movement.productId === productId);
  }

  adjust(productId: string, dto: AdjustStockDto): ReturnType<ProductsService['adjustStock']> {
    return this.productsService.adjustStock(productId, dto);
  }

  ensureProductExists(productId: string): void {
    try {
      this.productsService.findOne(productId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new UnprocessableEntityException('Unable to verify product');
    }
  }
}
