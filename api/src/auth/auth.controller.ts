import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthGuard } from './auth.guard.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

const COOKIE = 'smart-stock-session';
const cookieOptions = () => ({ httpOnly: true, sameSite: 'lax' as const, secure: process.env.COOKIE_SECURE === 'true', maxAge: 7 * 86400000, path: '/' });

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.register(dto);
    response.cookie(COOKIE, result.sessionId, cookieOptions());
    return { user: result.user };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(dto);
    response.cookie(COOKIE, result.sessionId, cookieOptions());
    return { user: result.user };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@Req() request: Request & { user: { id: string } }) {
    const user = await this.authService.getSessionUser(request.cookies?.[COOKIE]);
    return user;
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    await this.authService.logout(request.cookies?.[COOKIE]);
    response.clearCookie(COOKIE, { httpOnly: true, sameSite: 'lax', secure: process.env.COOKIE_SECURE === 'true', path: '/' });
  }
}
