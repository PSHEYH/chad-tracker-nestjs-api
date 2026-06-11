import { AuthUser } from '../../domain/entities/auth-user';

export class AuthUserResponseDto {
  id: string;
  email: string | null;
  role: string;

  static fromDomain(user: AuthUser): AuthUserResponseDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
