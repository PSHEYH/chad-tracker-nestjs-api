import { AuthResult } from '../../domain/entities/auth-result';
import { AuthUserResponseDto } from './auth-user-response.dto';

class AuthSessionResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt: number | null;
  tokenType: string;
}

export class AuthResultResponseDto {
  user: AuthUserResponseDto;
  session: AuthSessionResponseDto | null;

  static fromDomain(result: AuthResult): AuthResultResponseDto {
    return {
      user: AuthUserResponseDto.fromDomain(result.user),
      session: result.session
        ? {
            accessToken: result.session.accessToken,
            refreshToken: result.session.refreshToken,
            expiresIn: result.session.expiresIn,
            expiresAt: result.session.expiresAt,
            tokenType: result.session.tokenType,
          }
        : null,
    };
  }
}
