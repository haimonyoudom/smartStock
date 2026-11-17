import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../database/prisma.service.js';
import type { Product } from '@prisma/client';
import { CreateSaleDto } from './dto/create-sale.dto.js';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}
  findAll(businessId: string) { return this.prisma.sale.findMany({ where: { businessId }, include: { items: true }, orderBy: { saleDate: 'desc' } }); }
  async findOne(id: string, businessId: string) {
    const sale = await this.prisma.sale.findFirst({ where: { id, businessId }, include: { items: true } });
    if (!sale) throw new NotFoundException(`Sale ${id} not found`);
    return sale;
  }
  async findItems(businessId: string, saleId?: string) {
    if (saleId) await this.findOne(saleId, businessId);
    return this.prisma.saleItem.findMany({ where: { sale: { businessId }, ...(saleId ? { saleId } : {}) } });
  }
  async create(dto: CreateSaleDto, businessId: string, userId: string) {
    const requested = new Map<string, number>();
    for (const item of dto.items) requested.set(item.productId, (requested.get(item.productId) ?? 0) + item.quantity);
    return this.prisma.$transaction(async (tx) => {
      const products: { product: Product; quantity: number }[] = [];
      for (const [productId, quantity] of requested) {
        const product = await tx.product.findFirst({ where: { id: productId, businessId } });
        if (!product || !product.active) throw new NotFoundException(`Product ${productId} not found`);
        if (product.stockQuantity < quantity) throw new ConflictException(`Insufficient stock for product ${productId}`);
        products.push({ product, quantity });
      }
      const items = dto.items.map((item) => {
        const product = products.find((entry) => entry.product.id === item.productId)!.product;
        const subtotal = this.round(product.sellingPrice * item.quantity);
        return { businessId, productId: product.id, quantity: item.quantity, unitPrice: product.sellingPrice, subtotal };
      });
      const sale = await tx.sale.create({
        data: {
          businessId,
          saleNumber: randomUUID(),
          createdById: userId,
          totalAmount: this.round(items.reduce((sum, item) => sum + item.subtotal, 0)),
          items: { create: items },
        },
        include: { items: true },
      });
      for (const entry of products) {
        await tx.product.update({ where: { id: entry.product.id }, data: { stockQuantity: { decrement: entry.quantity } } });
        await tx.stockMovement.create({ data: { businessId, productId: entry.product.id, userId, movementType: 'SALE', quantityChange: -entry.quantity, reason: 'SALE' } });
      }
      return sale;
    });
  }
  private round(value: number) { return Math.round((value + Number.EPSILON) * 100) / 100; }
}
