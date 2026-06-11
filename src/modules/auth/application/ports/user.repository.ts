import { User } from '../../domain/entities/user';

export abstract class UserRepository {
  abstract create(user: User): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  // abstract incrementTokenVersion(id: string): Promise<void>;
}
