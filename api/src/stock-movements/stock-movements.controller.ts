import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard.js';
import { StockMovementsService } from './stock-movements.service.js';

@Controller('stockMovements')
@UseGuards(AuthGuard)
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Get()
  findAll(@Query('productId') productId: string | undefined, @Req() req: Request & { user: { businessId: string } }) {
    if (productId !== undefined) {
      return this.stockMovementsService.ensureProductExists(productId, req.user.businessId).then(() => this.stockMovementsService.findAll(req.user.businessId, productId));
    }
    return this.stockMovementsService.findAll(req.user.businessId);
  }
}
