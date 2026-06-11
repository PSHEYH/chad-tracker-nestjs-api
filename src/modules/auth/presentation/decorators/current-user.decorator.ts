import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../../domain/entities/auth-user';
import { AuthenticatedRequest } from '../guards/auth.guard';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser => {
    return context.switchToHttp().getRequest<AuthenticatedRequest>().user;
  },
);
