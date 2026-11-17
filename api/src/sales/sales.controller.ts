import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard.js';
import { CreateSaleDto } from './dto/create-sale.dto.js';
import { SalesService } from './sales.service.js';

@Controller()
@UseGuards(AuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get('sales')
  findAll(@Req() req: Request & { user: { businessId: string } }) {
    return this.salesService.findAll(req.user.businessId);
  }

  @Get('sales/:id')
  findOne(@Param('id') id: string, @Req() req: Request & { user: { businessId: string } }) {
    return this.salesService.findOne(id, req.user.businessId);
  }

  @Post('sales')
  create(@Body() dto: CreateSaleDto, @Req() req: Request & { user: { businessId: string; id: string } }) {
    return this.salesService.create(dto, req.user.businessId, req.user.id);
  }

  @Get('saleItems')
  findItems(@Query('saleId') saleId: string | undefined, @Req() req: Request & { user: { businessId: string } }) {
    return this.salesService.findItems(req.user.businessId, saleId);
  }
}
