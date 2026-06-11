import { Injectable } from '@nestjs/common';
import { AuthResult } from '../../domain/entities/auth-result';
import { AuthProvider } from '../ports/auth-provider';

@Injectable()
export class RefreshSessionUseCase {
  constructor(private readonly authProvider: AuthProvider) {}

  execute(refreshToken: string): Promise<AuthResult> {
    return this.authProvider.refresh(refreshToken);
  }
}
