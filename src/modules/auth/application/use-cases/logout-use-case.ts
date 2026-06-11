import { Injectable } from '@nestjs/common';
import { AuthProvider } from '../ports/auth-provider';

@Injectable()
export class LogoutUseCase {
  constructor(private readonly authProvider: AuthProvider) {}

  execute(accessToken: string): Promise<void> {
    return this.authProvider.logout(accessToken);
  }
}
