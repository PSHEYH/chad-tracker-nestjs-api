import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenVerifier } from '../../application/ports/auth-token-verifier';
import { UserRepository } from '../../application/ports/user.repository';
import { AuthUser } from '../../domain/entities/auth-user';
import { JwtPayload } from '../models/jwt-payload';

@Injectable()
export class NestJwtVerifier implements AuthTokenVerifier {
  private readonly jwtSecret: string;

  constructor(
    private readonly jwt: JwtService,
    private readonly users: UserRepository,
    config: ConfigService,
  ) {
    this.jwtSecret = config.getOrThrow<string>('JWT_SECRET');
  }

  async verify(accessToken: string): Promise<AuthUser | null> {
    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(accessToken, {
        secret: this.jwtSecret,
      });

      if (payload.tokenType !== 'access') {
        return null;
      }

      const user = await this.users.findById(payload.sub);

      if (!user) {
        return null;
      }

      return new AuthUser(user.id, user.email, user.role);
    } catch {
      return null;
    }
  }
}
