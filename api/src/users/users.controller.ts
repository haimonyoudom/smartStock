import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { UserRole } from '@prisma/client';
import { UsersService } from './users.service.js';
import { CreateCashierDto } from './dto/create-cashier.dto.js';
import { UpdateUserStatusDto } from './dto/update-user-status.dto.js';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.OWNER)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Req() req: Request & { user: { businessId: string } }) {
    return this.usersService.findAll(req.user.businessId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request & { user: { businessId: string } }) {
    return this.usersService.findOne(id, req.user.businessId);
  }

  @Post()
  create(@Body() dto: CreateCashierDto, @Req() req: Request & { user: { businessId: string } }) {
    return this.usersService.createCashier(dto, req.user.businessId);
  }

  @Patch(':id')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
    @Req() req: Request & { user: { businessId: string } },
  ) {
    return this.usersService.setActive(id, dto.active, req.user.businessId);
  }
}