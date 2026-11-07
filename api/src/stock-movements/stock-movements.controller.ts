import { Controller, Get, Query } from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service.js';

@Controller('stockMovements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Get()
  findAll(@Query('productId') productId?: string) {
    if (productId !== undefined) {
      this.stockMovementsService.ensureProductExists(productId);
    }
    return this.stockMovementsService.findAll(productId);
  }
}
