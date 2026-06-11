import { Injectable } from '@nestjs/common';
import { AuthResult } from '../../domain/entities/auth-result';
import { AuthProvider } from '../ports/auth-provider';

@Injectable()
export class GoogleLoginUseCase {
  constructor(private readonly authProvider: AuthProvider) {}

  execute(idToken: string): Promise<AuthResult> {
    return this.authProvider.loginWithGoogle(idToken);
  }
}
