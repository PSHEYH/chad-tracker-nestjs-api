export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string | null,
    public readonly role: string,
    public readonly googleSubject: string | null = null,
  ) {}
}
