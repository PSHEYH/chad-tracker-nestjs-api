import { Injectable } from '@nestjs/common';
import { AuthResult } from '../../domain/entities/auth-result';
import { AuthProvider } from '../ports/auth-provider';

@Injectable()
export class RegisterUseCase {
  constructor(private readonly authProvider: AuthProvider) {}

  execute(email: string, password: string): Promise<AuthResult> {
    return this.authProvider.register(email, password);
  }
}
