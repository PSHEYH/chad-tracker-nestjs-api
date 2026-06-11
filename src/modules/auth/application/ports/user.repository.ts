import { User } from '../../domain/entities/user';

export abstract class UserRepository {
  abstract create(user: User): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByGoogleSubject(subject: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract linkGoogleSubject(id: string, subject: string): Promise<User>;
  // abstract incrementTokenVersion(id: string): Promise<void>;
}
