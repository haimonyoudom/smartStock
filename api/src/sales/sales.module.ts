import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module.js';
import { SalesController } from './sales.controller.js';
import { SalesService } from './sales.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [ProductsModule, AuthModule],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
