import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { AdjustStockDto } from '../stock-movements/dto/adjust-stock.dto.js';
import { ProductsService } from './products.service.js';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Req() req: Request & { user: { businessId: string } }) {
    return this.productsService.findAll(req.user.businessId);
  }

  @Get('low-stock')
  findLowStock(@Req() req: Request & { user: { businessId: string } }) {
    return this.productsService.findLowStock(req.user.businessId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request & { user: { businessId: string } }) {
    return this.productsService.findOne(id, req.user.businessId);
  }

  @Post()
  create(@Body() dto: CreateProductDto, @Req() req: Request & { user: { businessId: string } }) {
    return this.productsService.create(dto, req.user.businessId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto, @Req() req: Request & { user: { businessId: string } }) {
    return this.productsService.update(id, dto, req.user.businessId);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string, @Req() req: Request & { user: { businessId: string } }) {
    return this.productsService.remove(id, req.user.businessId);
  }

  @Post(':id/adjust-stock')
  adjustStock(@Param('id') id: string, @Body() dto: AdjustStockDto, @Req() req: Request & { user: { businessId: string; id: string } }) {
    return this.productsService.adjustStock(id, dto, req.user.businessId, req.user.id);
  }
}
