import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from '../database/prisma.service.js';
import { CreateCashierDto } from './dto/create-cashier.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(businessId: string) {
    return this.prisma.user.findMany({ where: { businessId }, select: { id: true, name: true, email: true, role: true, active: true } });
  }
  async findOne(id: string, businessId: string) {
    const user = await this.prisma.user.findFirst({ where: { id, businessId }, select: { id: true, name: true, email: true, role: true, active: true } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async createCashier(dto: CreateCashierDto, businessId: string) {
    try {
      return await this.prisma.user.create({
        data: {
          businessId,
          name: dto.name,
          email: dto.email.toLowerCase(),
          passwordHash: await hash(dto.password, 12),
          role: 'CASHIER',
        },
        select: { id: true, name: true, email: true, role: true, active: true },
      });
    } catch {
      throw new ConflictException('Email is already registered');
    }
  }

  async setActive(id: string, active: boolean, businessId: string) {
    const user = await this.prisma.user.findFirst({ where: { id, businessId } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    if (user.role === 'OWNER') throw new ConflictException('Owner accounts cannot be deactivated');
    return this.prisma.user.update({
      where: { id },
      data: { active },
      select: { id: true, name: true, email: true, role: true, active: true },
    });
  }
}
