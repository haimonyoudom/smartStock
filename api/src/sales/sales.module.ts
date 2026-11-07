import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module.js';
import { SalesController } from './sales.controller.js';
import { SalesService } from './sales.service.js';

@Module({
  imports: [ProductsModule],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
