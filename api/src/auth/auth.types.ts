import type { Request } from 'express';
import type { UserRole } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user: { id: string; businessId: string; role: UserRole; email: string };
}
