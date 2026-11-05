import { Injectable, NotFoundException } from '@nestjs/common';
import { StoredUser, User } from './user.entity.js';

@Injectable()
export class UsersService {
  // Demo data: copy from db.json
  private readonly users: StoredUser[] = [
    { id: 'u1', name: 'Owner', email: 'owner@shop.com', role: 'OWNER', active: true, password: 'password123' },
    { id: 'u2', name: 'Cashier', email: 'cashier@shop.com', role: 'CASHIER', active: true, password: 'password123' },
  ];

  private toPublic({ password, ...user }: StoredUser): User {
    return user;
  }

  findAll(): User[] {
    return this.users.map((u) => this.toPublic(u));
  }

  findOne(id: string): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return this.toPublic(user);
  }

  // Internal use only (auth): includes password
  findByEmail(email: string): StoredUser | undefined {
    return this.users.find((u) => u.email === email);
  }

  sanitize(user: StoredUser): User {
    return this.toPublic(user);
  }
}