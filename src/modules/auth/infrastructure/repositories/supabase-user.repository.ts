import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../../../infrastructure/supabase/supabase.service';
import { AuthOperationError } from '../../application/errors/auth-operation.error';
import { UserRepository } from '../../application/ports/user.repository';
import { User } from '../../domain/entities/user';

type UserRow = {
  id: string;
  email: string;
  password_hash: string | null;
  role: string;
};

@Injectable()
export class SupabaseUserRepository implements UserRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async create(user: User): Promise<User> {
    const { data, error } = await this.supabase.client
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        password_hash: user.password,
        role: user.role
      })
      .select()
      .single();

    if (error) {
      const status = error.code === '23505' ? 409 : 500;
      const message =
        error.code === '23505' ? 'Email is already registered' : error.message;
      throw new AuthOperationError(message, status);
    }

    return this.toDomain(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne('email', email);
  }

  async findById(id: string): Promise<User | null> {
    return this.findOne('id', id);
  }


  // async incrementTokenVersion(id: string): Promise<void> {
  //   const user = await this.findById(id);

  //   if (!user) {
  //     throw new AuthOperationError('User not found', 401);
  //   }

  //   const { error } = await this.supabase.client
  //     .from('users')
  //     .update({ token_version: user.tokenVersion + 1 })
  //     .eq('id', id);

  //   if (error) {
  //     throw new AuthOperationError(error.message, 500);
  //   }
  // }

  private async findOne(
    column: 'id' | 'email',
    value: string,
  ) {
    const { data, error } = await this.supabase.client
      .from('users')
      .select('*')
      .eq(column, value)
      .maybeSingle();

    if (error) {
      throw new AuthOperationError(error.message, 500);
    }

    return data ? this.toDomain(data) : null;
  }

  private toDomain(row: UserRow): User {
    return new User(
      row.id,
      row.email,
      row.password_hash,
      row.role,
    );
  }
}
