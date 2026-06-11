import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthProvider } from './application/ports/auth-provider';
import { AuthTokenVerifier } from './application/ports/auth-token-verifier';
import { GoogleIdentityVerifier } from './application/ports/google-identity-verifier';
import { UserRepository } from './application/ports/user.repository';
import { LoginUseCase } from './application/use-cases/login-use-case';
import { GoogleLoginUseCase } from './application/use-cases/google-login-use-case';
import { LogoutUseCase } from './application/use-cases/logout-use-case';
import { RefreshSessionUseCase } from './application/use-cases/refresh-session-use-case';
import { RegisterUseCase } from './application/use-cases/register-use-case';
import { PasswordHasher } from './infrastructure/crypto/password-hasher';
import { NestAuthProvider } from './infrastructure/providers/nest-auth.provider';
import { SupabaseUserRepository } from './infrastructure/repositories/supabase-user.repository';
import { NestJwtVerifier } from './infrastructure/strategies/nest-jwt.verifier';
import { GoogleIdTokenVerifier } from './infrastructure/strategies/google-id-token.verifier';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthGuard } from './presentation/guards/auth.guard';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthGuard,
    PasswordHasher,
    RegisterUseCase,
    LoginUseCase,
    GoogleLoginUseCase,
    LogoutUseCase,
    RefreshSessionUseCase,
    {
      provide: AuthProvider,
      useClass: NestAuthProvider,
    },
    {
      provide: AuthTokenVerifier,
      useClass: NestJwtVerifier,
    },
    {
      provide: GoogleIdentityVerifier,
      useClass: GoogleIdTokenVerifier,
    },
    {
      provide: UserRepository,
      useClass: SupabaseUserRepository,
    },
  ],
  exports: [AuthGuard, AuthTokenVerifier],
})
export class AuthModule {}
