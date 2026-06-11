import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthTokenVerifier } from '../../application/ports/auth-token-verifier';
import { AuthUser } from '../../domain/entities/auth-user';

export type AuthenticatedRequest = Request & {
  user: AuthUser;
  accessToken: string;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenVerifier: AuthTokenVerifier) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const accessToken = this.extractBearerToken(request);

    if (!accessToken) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const user = await this.tokenVerifier.verify(accessToken);

    if (!user) {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    request.user = user;
    request.accessToken = accessToken;
    return true;
  }

  private extractBearerToken(request: Request): string | null {
    const [scheme, token] = request.headers.authorization?.split(' ') ?? [];

    return scheme?.toLowerCase() === 'bearer' && token ? token : null;
  }
}
