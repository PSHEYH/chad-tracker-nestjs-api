export class AuthUser {
  constructor(
    public readonly id: string,
    public readonly email: string | null,
    public readonly role: string,
  ) {}
}
