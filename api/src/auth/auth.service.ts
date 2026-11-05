import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  login({ email, password }: LoginDto) {
    const user = this.usersService.findByEmail(email);
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      accessToken: `demo-token-${user.id}`, // real JWT in week 8
      user: this.usersService.sanitize(user),
    };
  }
}