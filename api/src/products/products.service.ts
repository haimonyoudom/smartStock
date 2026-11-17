import { BadRequestException, ConflictException, Injectable, NotFoundException, Optional, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { AdjustStockDto } from '../stock-movements/dto/adjust-stock.dto.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductsService {
  private readonly prisma: PrismaService;
  constructor(@Optional() prisma?: PrismaService) { this.prisma = prisma!; }
  async findAll(businessId: string) { return this.prisma.product.findMany({ where: { businessId }, orderBy: { name: 'asc' } }); }
  async findLowStock(businessId: string) { return this.prisma.product.findMany({ where: { businessId, active: true }, orderBy: { stockQuantity: 'asc' } }).then((items) => items.filter((p) => p.stockQuantity <= p.lowStockThreshold)); }
  async findOne(id: string, businessId: string) {
    const product = await this.prisma.product.findFirst({ where: { id, businessId } });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }
  async create(dto: CreateProductDto, businessId: string) {
    try {
      return await this.prisma.product.create({
        data: {
          businessId,
          name: dto.name,
          sku: dto.sku,
          sellingPrice: dto.sellingPrice,
          stockQuantity: dto.stockQuantity,
          lowStockThreshold: dto.lowStockThreshold,
          active: dto.active ?? true,
        },
      });
    }
    catch { throw new ConflictException(`SKU ${dto.sku} is already in use`); }
  }
  async update(id: string, dto: UpdateProductDto, businessId: string) {
    await this.findOne(id, businessId);
    if (!Object.keys(dto).length) throw new BadRequestException('At least one field is required');
    try { return await this.prisma.product.update({ where: { id }, data: dto }); } catch { throw new ConflictException('SKU is already in use'); }
  }
  async remove(id: string, businessId: string) { await this.findOne(id, businessId); await this.prisma.product.delete({ where: { id } }); }
  async adjustStock(id: string, dto: AdjustStockDto, businessId: string, userId: string) {
    const product = await this.findOne(id, businessId);
    const next = product.stockQuantity + dto.quantityChange;
    if (next < 0) throw new UnprocessableEntityException('Stock cannot be negative');
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({ where: { id }, data: { stockQuantity: next } });
      await tx.stockMovement.create({ data: { businessId, productId: id, userId, movementType: 'ADJUSTMENT', quantityChange: dto.quantityChange, reason: dto.reason } });
      return updated;
    });
  }
}
