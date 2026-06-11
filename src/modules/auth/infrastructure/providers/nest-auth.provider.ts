import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { AuthOperationError } from '../../application/errors/auth-operation.error';
import { AuthProvider } from '../../application/ports/auth-provider';
import { GoogleIdentityVerifier } from '../../application/ports/google-identity-verifier';
import { UserRepository } from '../../application/ports/user.repository';
import { AuthResult } from '../../domain/entities/auth-result';
import { AuthSession } from '../../domain/entities/auth-session';
import { AuthUser } from '../../domain/entities/auth-user';
import { User } from '../../domain/entities/user';
import { PasswordHasher } from '../crypto/password-hasher';
import { JwtPayload } from '../models/jwt-payload';

@Injectable()
export class NestAuthProvider implements AuthProvider {
  private readonly jwtSecret: string;
  private readonly accessTokenTtl: number;
  private readonly refreshTokenTtl: number;

  constructor(
    private readonly users: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly googleIdentityVerifier: GoogleIdentityVerifier,
    private readonly jwt: JwtService,
    config: ConfigService,
  ) {
    this.jwtSecret = config.getOrThrow<string>('JWT_SECRET');
    this.accessTokenTtl = config.get<number>('JWT_ACCESS_TOKEN_TTL', 3600);
    this.refreshTokenTtl = config.get<number>('JWT_REFRESH_TOKEN_TTL', 604800);
  }

  async register(email: string, password: string): Promise<AuthResult> {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await this.users.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new AuthOperationError('Email is already registered', 409);
    }

    const user = await this.users.create(
      new User(
        randomUUID(),
        normalizedEmail,
        await this.passwordHasher.hash(password),
        'user',
      ),
    );

    return this.createAuthResult(user);
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.users.findByEmail(email.trim().toLowerCase());

    if (
      !user?.password ||
      !(await this.passwordHasher.verify(password, user.password))
    ) {
      throw new AuthOperationError('Invalid email or password', 401);
    }

    return this.createAuthResult(user);
  }

  async loginWithGoogle(idToken: string): Promise<AuthResult> {
    // const identity = await this.googleIdentityVerifier.verify(idToken);
    // let user = await this.users.findByGoogleSubject(identity.subject);

    // if (!user) {
    //   const existingUser = await this.users.findByEmail(identity.email);

    //   user = existingUser
    //     ? await this.users.linkGoogleSubject(existingUser.id, identity.subject)
    //     : await this.users.create(
    //         new User(
    //           randomUUID(),
    //           identity.email,
    //           null,
    //           'user',
    //           identity.subject,
    //         ),
    //       );
    // }

    // return this.createAuthResult(user);
    throw new AuthOperationError('Google login is not implemented yet', 501);
  }

  async refresh(refreshToken: string): Promise<AuthResult> {
    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.jwtSecret,
      });

      if (payload.tokenType !== 'refresh') {
        throw new AuthOperationError('Invalid or expired refresh token', 401);
      }

      const user = await this.users.findById(payload.sub);

      if (!user) {
        throw new AuthOperationError('Invalid or expired refresh token', 401);
      }

      return this.createAuthResult(user);
    } catch (error) {
      if (error instanceof AuthOperationError) {
        throw error;
      }
      throw new AuthOperationError('Invalid or expired refresh token', 401);
    }
  }

  async logout(accessToken: string): Promise<void> {
    try {
      await this.jwt.verifyAsync<JwtPayload>(accessToken, {
        secret: this.jwtSecret,
      });
      //await this.users.incrementTokenVersion(payload.sub);
    } catch (error) {
      if (error instanceof AuthOperationError) {
        throw error;
      }
      throw new AuthOperationError('Invalid or expired access token', 401);
    }
  }

  private async createAuthResult(user: User): Promise<AuthResult> {
    const authUser = new AuthUser(user.id, user.email, user.role);
    const basePayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = await this.jwt.signAsync(
      { ...basePayload, tokenType: 'access' },
      { secret: this.jwtSecret, expiresIn: this.accessTokenTtl },
    );
    const refreshToken = await this.jwt.signAsync(
      { ...basePayload, tokenType: 'refresh' },
      { secret: this.jwtSecret, expiresIn: this.refreshTokenTtl },
    );
    const now = Math.floor(Date.now() / 1000);

    return new AuthResult(
      authUser,
      new AuthSession(
        accessToken,
        refreshToken,
        this.accessTokenTtl,
        now + this.accessTokenTtl,
        'bearer',
        authUser,
      ),
    );
  }
}
