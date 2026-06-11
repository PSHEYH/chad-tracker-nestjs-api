import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './supabase.types';

@Injectable()
export class SupabaseService {
  private readonly supabaseClient: SupabaseClient<Database>;
  private readonly url: string;
  private readonly serviceRoleKey: string;

  constructor(private readonly configService: ConfigService) {
    this.url = this.configService.getOrThrow<string>('SUPABASE_URL');
    this.serviceRoleKey = this.configService.getOrThrow<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );

    this.supabaseClient = this.createClient(this.serviceRoleKey);
  }

  private createClient(key: string): SupabaseClient<Database> {
    return createClient<Database>(this.url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  get client(): SupabaseClient<Database> {
    return this.supabaseClient;
  }
}
