export type GoogleIdentity = {
  subject: string;
  email: string;
};

export abstract class GoogleIdentityVerifier {
  abstract verify(idToken: string): Promise<GoogleIdentity>;
}
