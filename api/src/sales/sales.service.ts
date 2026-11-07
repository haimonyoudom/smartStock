import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsService } from '../products/products.service.js';
import { CreateSaleDto } from './dto/create-sale.dto.js';
import { Sale, SaleItem } from './sale.entity.js';

@Injectable()
export class SalesService {
  private readonly sales: Sale[] = [];
  private readonly saleItems: SaleItem[] = [];

  constructor(private readonly productsService: ProductsService) {}

  findAll(): Sale[] {
    return this.sales;
  }

  findOne(id: string): Sale {
    const sale = this.sales.find((item) => item.id === id);
    if (!sale) {
      throw new NotFoundException(`Sale ${id} not found`);
    }
    return sale;
  }

  findItems(saleId?: string): SaleItem[] {
    return saleId === undefined
      ? this.saleItems
      : this.saleItems.filter((item) => item.saleId === saleId);
  }

  create(dto: CreateSaleDto): Sale {
    const requested = new Map<string, number>();
    for (const item of dto.items) {
      requested.set(item.productId, (requested.get(item.productId) ?? 0) + item.quantity);
    }

    for (const [productId, quantity] of requested) {
      const product = this.productsService.findOne(productId);
      if (!product.active) {
        throw new ConflictException(`Product ${productId} is inactive`);
      }
      if (product.stockQuantity < quantity) {
        throw new ConflictException(`Insufficient stock for product ${productId}`);
      }
    }

    const sale: Sale = {
      id: `${1042 + this.sales.length}`,
      saleDate: new Date().toISOString(),
      totalAmount: 0,
      createdBy: 'u1',
    };

    for (const item of dto.items) {
      const product = this.productsService.findOne(item.productId);
      const subtotal = this.round(product.sellingPrice * item.quantity);
      this.saleItems.push({
        id: `si${this.saleItems.length + 1}`,
        saleId: sale.id,
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.sellingPrice,
        subtotal,
      });
      product.stockQuantity -= item.quantity;
      this.productsService.recordSaleMovement(product.id, item.quantity);
      sale.totalAmount += subtotal;
    }
    sale.totalAmount = this.round(sale.totalAmount);
    this.sales.push(sale);
    return sale;
  }

  private round(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
