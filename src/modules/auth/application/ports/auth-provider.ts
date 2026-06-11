import { AuthResult } from '../../domain/entities/auth-result';

export abstract class AuthProvider {
  abstract register(email: string, password: string): Promise<AuthResult>;
  abstract login(email: string, password: string): Promise<AuthResult>;
  abstract loginWithGoogle(idToken: string): Promise<AuthResult>;
  abstract refresh(refreshToken: string): Promise<AuthResult>;
  abstract logout(accessToken: string): Promise<void>;
}
