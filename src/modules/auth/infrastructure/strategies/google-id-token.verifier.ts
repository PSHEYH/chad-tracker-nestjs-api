import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { AuthOperationError } from '../../application/errors/auth-operation.error';
import {
  GoogleIdentity,
  GoogleIdentityVerifier,
} from '../../application/ports/google-identity-verifier';

@Injectable()
export class GoogleIdTokenVerifier implements GoogleIdentityVerifier {
  private readonly client: OAuth2Client;
  private readonly clientId: string;

  constructor(config: ConfigService) {
    this.clientId = config.getOrThrow<string>('GOOGLE_CLIENT_ID');
    this.client = new OAuth2Client(this.clientId);
  }

  async verify(idToken: string): Promise<GoogleIdentity> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.clientId,
      });
      const payload = ticket.getPayload();

      if (!payload?.sub || !payload.email || !payload.email_verified) {
        throw new AuthOperationError('Invalid Google identity', 401);
      }

      return {
        subject: payload.sub,
        email: payload.email.trim().toLowerCase(),
      };
    } catch (error) {
      if (error instanceof AuthOperationError) {
        throw error;
      }

      throw new AuthOperationError('Invalid Google ID token', 401);
    }
  }
}
