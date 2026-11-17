import { CanActivate, ExecutionContext, Injectable, Optional, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Optional() private readonly authService?: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const sessionId = request.cookies?.['smart-stock-session'];
    const user = sessionId && this.authService ? await this.authService.getSessionUser(sessionId) : null;
    if (!user) throw new UnauthorizedException('Authentication required');
    (request as Request & { user: typeof user }).user = user;
    return true;
  }
}
