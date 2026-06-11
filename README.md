# Chad Tracker API

NestJS backend for Chad Tracker.

## Authentication

Authentication is owned by this NestJS application:

- Passwords are hashed with Node.js `scrypt`.
- Google ID tokens can be exchanged for local access and refresh tokens.
- NestJS issues and verifies access and refresh JWTs.
- `POST /auth/refresh` rotates a valid refresh token into a new session.
- Users are persisted in the Supabase `public.users` table.
- Logout increments the user's token version and invalidates existing tokens.
- Supabase Auth and `SUPABASE_ANON_KEY` are not used.

Supabase remains the database provider. Keep the service-role key private and only
use it on the backend.

## Setup

```bash
npm install
cp .env.example .env
```

Apply [the users migration](supabase/migrations/20260607000000_create_users.sql)
to the Supabase database before registering users.

Required environment variables:

```dotenv
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=replace-with-a-long-random-secret
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

Optional token lifetimes are expressed in seconds:

```dotenv
JWT_ACCESS_TOKEN_TTL=900
JWT_REFRESH_TOKEN_TTL=604800
```

## Run

```bash
npm run start:dev
```

## Verify

```bash
npm run build
npm test
npm run lint
```
# chad-tracker-nestjs-api
