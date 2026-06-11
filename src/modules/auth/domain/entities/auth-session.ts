import { AuthUser } from './auth-user';

export class AuthSession {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly expiresIn: number,
    public readonly expiresAt: number | null,
    public readonly tokenType: string,
    public readonly user: AuthUser,
  ) {}
}
