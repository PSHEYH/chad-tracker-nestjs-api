import { AuthUser } from '../../domain/entities/auth-user';

export abstract class AuthTokenVerifier {
  abstract verify(accessToken: string): Promise<AuthUser | null>;
}
