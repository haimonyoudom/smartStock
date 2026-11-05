import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from './products.entity.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductsService {
  private readonly products: Product[] = [
    {
      id: 'p1',
      name: 'Coca-Cola 330ml',
      sku: 'CC-330',
      sellingPrice: 0.8,
      stockQuantity: 39,
      lowStockThreshold: 10,
      active: true,
    },
    {
      id: 'p2',
      name: 'Milk 1L',
      sku: 'MK-1L',
      sellingPrice: 1.5,
      stockQuantity: 2,
      lowStockThreshold: 5,
      active: true,
    },
  ];

  findAll(): Product[] {
    return this.products;
  }

  findLowStock(): Product[] {
    return this.products.filter(
      ({ stockQuantity, lowStockThreshold }) =>
        stockQuantity <= lowStockThreshold,
    );
  }

  findOne(id: string): Product {
    const product = this.products.find((item) => item.id === id);
    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }
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
    if (index === -1) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    this.products.splice(index, 1);
  }

  private ensureSkuAvailable(sku: string, excludedId?: string): void {
    const duplicate = this.products.some(
      (product) => product.sku === sku && product.id !== excludedId,
    );
    if (duplicate) {
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
