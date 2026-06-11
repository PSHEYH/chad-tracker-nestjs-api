import { AuthSession } from './auth-session';
import { AuthUser } from './auth-user';

export class AuthResult {
  constructor(
    public readonly user: AuthUser,
    public readonly session: AuthSession | null,
  ) {}
}
