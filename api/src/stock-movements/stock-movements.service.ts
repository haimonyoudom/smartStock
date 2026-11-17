import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { AdjustStockDto } from './dto/adjust-stock.dto.js';

@Injectable()
export class StockMovementsService {
  constructor(private readonly prisma: PrismaService) {}
  findAll(businessId: string, productId?: string) {
    return this.prisma.stockMovement.findMany({ where: { businessId, ...(productId ? { productId } : {}) }, orderBy: { createdAt: 'desc' } });
  }
  async adjust(productId: string, dto: AdjustStockDto, businessId: string, userId: string) {
    const product = await this.prisma.product.findFirst({ where: { id: productId, businessId } });
    if (!product) throw new NotFoundException(`Product ${productId} not found`);
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({ where: { id: productId }, data: { stockQuantity: { increment: dto.quantityChange } } });
      if (updated.stockQuantity < 0) throw new NotFoundException('Stock cannot be negative');
      await tx.stockMovement.create({ data: { businessId, productId, userId, movementType: 'ADJUSTMENT', quantityChange: dto.quantityChange, reason: dto.reason } });
      return updated;
    });
  }
  async ensureProductExists(productId: string, businessId: string) {
    if (!await this.prisma.product.findFirst({ where: { id: productId, businessId }, select: { id: true } })) throw new NotFoundException(`Product ${productId} not found`);
  }
}
