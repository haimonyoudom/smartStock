import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { ProductsModule } from './products/products.module.js';
import { AuthModule } from './auth/auth.module.js';
import { StockMovementsModule } from './stock-movements/stock-movements.module.js';
import { SalesModule } from './sales/sales.module.js';

@Module({
  imports: [UsersModule, ProductsModule, AuthModule, StockMovementsModule, SalesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
