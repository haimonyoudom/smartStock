import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module.js';
import { StockMovementsController } from './stock-movements.controller.js';
import { StockMovementsService } from './stock-movements.service.js';

@Module({
  imports: [ProductsModule],
  controllers: [StockMovementsController],
  providers: [StockMovementsService],
  exports: [StockMovementsService],
})
export class StockMovementsModule {}
