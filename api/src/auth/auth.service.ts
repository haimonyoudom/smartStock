import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { randomUUID } from 'node:crypto';
import { compare, hash } from 'bcryptjs';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

const SESSION_DAYS = 7;

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email is already registered');
    const user = await this.prisma.user.create({
      data: {
        email,
        name: dto.name,
        passwordHash: await hash(dto.password, 12),
        role: 'OWNER',
        business: { create: { name: dto.businessName, businessType: dto.businessType } },
      },
      include: { business: true },
    });
    return this.createSession(user);
  }

  async login({ email, password }: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() }, include: { business: true } });
    if (!user || !user.active || !(await compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.createSession(user);
  }

  async getSessionUser(id: string) {
    const session = await this.prisma.session.findUnique({ where: { id }, include: { user: { include: { business: true } } } });
    if (!session || session.expiresAt <= new Date() || !session.user.active) return null;
    return {
      id: session.user.id,
      businessId: session.businessId,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
      active: session.user.active,
      business: {
        id: session.user.business.id,
        name: session.user.business.name,
        businessType: session.user.business.businessType,
      },
    };
  }

  async logout(id?: string) {
    if (id) await this.prisma.session.deleteMany({ where: { id } });
  }

  private async createSession(user: { id: string; businessId: string; email: string; role: 'OWNER' | 'CASHIER'; name: string; active: boolean; business: { id: string; name: string; businessType: string } }) {
    const id = randomUUID();
    await this.prisma.session.create({
      data: { id, userId: user.id, businessId: user.businessId, expiresAt: new Date(Date.now() + SESSION_DAYS * 86400000) },
    });
    return {
      sessionId: id,
      user: {
        id: user.id,
        businessId: user.businessId,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
        business: user.business,
      },
    };
  }

  publicUser(user: { id: string; name: string; email: string; role: 'OWNER' | 'CASHIER'; active: boolean }) {
    return { id: user.id, name: user.name, email: user.email, role: user.role, active: user.active };
  }
}
