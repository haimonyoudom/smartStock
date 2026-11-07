import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto.js';
import { SalesService } from './sales.service.js';

@Controller()
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get('sales')
  findAll() {
    return this.salesService.findAll();
  }

  @Get('sales/:id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Post('sales')
  create(@Body() dto: CreateSaleDto) {
    return this.salesService.create(dto);
  }

  @Get('saleItems')
  findItems(@Query('saleId') saleId?: string) {
    if (saleId !== undefined) {
      this.salesService.findOne(saleId);
    }
    return this.salesService.findItems(saleId);
  }
}
