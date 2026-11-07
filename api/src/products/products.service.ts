import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AdjustStockDto } from '../stock-movements/dto/adjust-stock.dto.js';
import { StockMovement } from '../stock-movements/stock-movement.entity.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { Product } from './products.entity.js';

@Injectable()
export class ProductsService {
  private readonly products: Product[] = [
    { id: 'p1', name: 'Coca-Cola 330ml', sku: 'CC-330', sellingPrice: 0.8, stockQuantity: 39, lowStockThreshold: 10, active: true },
    { id: 'p2', name: 'Milk 1L', sku: 'MK-1L', sellingPrice: 1.5, stockQuantity: 2, lowStockThreshold: 5, active: true },
    { id: 'p3', name: 'Instant noodles', sku: 'NO-01', sellingPrice: 0.4, stockQuantity: 120, lowStockThreshold: 20, active: true },
    { id: 'p4', name: 'Rice 5kg', sku: 'RC-5', sellingPrice: 6, stockQuantity: 15, lowStockThreshold: 5, active: true },
    { id: 'p5', name: 'Sugar 1kg', sku: 'SG-1', sellingPrice: 1.2, stockQuantity: 4, lowStockThreshold: 10, active: true },
  ];
  private readonly movements: StockMovement[] = [];

  findAll(): Product[] {
    return this.products;
  }

  findLowStock(): Product[] {
    return this.products.filter(
      ({ stockQuantity, lowStockThreshold }) => stockQuantity <= lowStockThreshold,
    );
  }

  findOne(id: string): Product {
    const product = this.products.find((item) => item.id === id);
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  create(dto: CreateProductDto): Product {
    this.ensureSkuAvailable(dto.sku);
    const product: Product = {
      id: this.nextId(),
      name: dto.name,
      sku: dto.sku,
      sellingPrice: dto.sellingPrice,
      stockQuantity: dto.stockQuantity,
      lowStockThreshold: dto.lowStockThreshold,
      active: dto.active ?? true,
    };
    this.products.push(product);
    return product;
  }

  update(id: string, dto: UpdateProductDto): Product {
    const product = this.findOne(id);
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('At least one field is required');
    }
    if (dto.sku !== undefined && dto.sku !== product.sku) {
      this.ensureSkuAvailable(dto.sku, id);
    }
    Object.assign(product, dto);
    return product;
  }

  remove(id: string): void {
    const index = this.products.findIndex((item) => item.id === id);
    if (index === -1) throw new NotFoundException(`Product ${id} not found`);
    this.products.splice(index, 1);
  }

  adjustStock(id: string, dto: AdjustStockDto): Product {
    const product = this.findOne(id);
    const nextQuantity = product.stockQuantity + dto.quantityChange;
    if (nextQuantity < 0) {
      throw new UnprocessableEntityException('Stock cannot be negative');
    }
    product.stockQuantity = nextQuantity;
    this.addMovement({
      productId: id,
      userId: 'u1',
      movementType: 'ADJUSTMENT',
      quantityChange: dto.quantityChange,
      reason: dto.reason,
    });
    return product;
  }

  getMovements(): StockMovement[] {
    return this.movements;
  }

  recordSaleMovement(productId: string, quantity: number): void {
    this.addMovement({
      productId,
      userId: 'u1',
      movementType: 'SALE',
      quantityChange: -quantity,
      reason: 'SALE',
    });
  }

  private addMovement(
    movement: Omit<StockMovement, 'id' | 'createdAt'>,
  ): void {
    this.movements.push({
      ...movement,
      id: `sm${this.movements.length + 1}`,
      createdAt: new Date().toISOString(),
    });
  }

  private ensureSkuAvailable(sku: string, excludedId?: string): void {
    if (this.products.some((product) => product.sku === sku && product.id !== excludedId)) {
      throw new ConflictException(`SKU ${sku} is already in use`);
    }
  }

  private nextId(): string {
    const numbers = this.products
      .map(({ id }) => Number(id.slice(1)))
      .filter((id) => Number.isInteger(id));
    return `p${Math.max(0, ...numbers) + 1}`;
  }
}
