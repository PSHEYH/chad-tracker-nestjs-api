import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../application/ports/user.repository';
import { GoogleIdentityVerifier } from '../../application/ports/google-identity-verifier';
import { User } from '../../domain/entities/user';
import { PasswordHasher } from '../crypto/password-hasher';
import { NestAuthProvider } from './nest-auth.provider';

describe('NestAuthProvider Google sign-in', () => {
  const identity = {
    subject: 'google-subject',
    email: 'user@example.com',
  };
  let findByGoogleSubject: jest.MockedFunction<
    UserRepository['findByGoogleSubject']
  >;
  let findByEmail: jest.MockedFunction<UserRepository['findByEmail']>;
  let create: jest.MockedFunction<UserRepository['create']>;
  let linkGoogleSubject: jest.MockedFunction<
    UserRepository['linkGoogleSubject']
  >;
  let provider: NestAuthProvider;

  beforeEach(() => {
    findByGoogleSubject = jest.fn(() => Promise.resolve(null));
    findByEmail = jest.fn(() => Promise.resolve(null));
    create = jest.fn((user) => Promise.resolve(user));
    linkGoogleSubject = jest.fn((id, subject) =>
      Promise.resolve(new User(id, identity.email, 'hash', 'user', subject)),
    );

    const users: UserRepository = {
      create,
      findByEmail,
      findByGoogleSubject,
      findById: jest.fn(),
      linkGoogleSubject,
    };
    const googleIdentityVerifier: GoogleIdentityVerifier = {
      verify: jest.fn(() => Promise.resolve(identity)),
    };

    provider = new NestAuthProvider(
      users,
      new PasswordHasher(),
      googleIdentityVerifier,
      new JwtService(),
      new ConfigService({
        JWT_SECRET: 'test-secret',
        JWT_ACCESS_TOKEN_TTL: 900,
        JWT_REFRESH_TOKEN_TTL: 604800,
      }),
    );
  });

  it('creates a passwordless user for a new Google identity', async () => {
    const result = await provider.loginWithGoogle('id-token');

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: identity.email,
        password: null,
        googleSubject: identity.subject,
      }),
    );
    expect(result.user.email).toBe(identity.email);
    expect(result.session?.accessToken).toBeDefined();
  });

  it('links an existing account with the same verified email', async () => {
    const existingUser = new User(
      '9060cc95-1705-4f3f-9673-efabb08b2369',
      identity.email,
      'hash',
      'user',
    );
    findByEmail.mockResolvedValueOnce(existingUser);

    await provider.loginWithGoogle('id-token');

    expect(linkGoogleSubject).toHaveBeenCalledWith(
      existingUser.id,
      identity.subject,
    );
    expect(create).not.toHaveBeenCalled();
  });

  it('uses an already-linked Google account', async () => {
    const existingUser = new User(
      '9060cc95-1705-4f3f-9673-efabb08b2369',
      identity.email,
      null,
      'user',
      identity.subject,
    );
    findByGoogleSubject.mockResolvedValueOnce(existingUser);

    await provider.loginWithGoogle('id-token');

    expect(findByEmail).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
    expect(linkGoogleSubject).not.toHaveBeenCalled();
  });
});
