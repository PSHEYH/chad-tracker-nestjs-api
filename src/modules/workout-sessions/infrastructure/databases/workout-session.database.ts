import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../../../infrastructure/supabase/supabase.service';
import { WorkoutSessionModel } from '../models/workout-session.model';

@Injectable()
export class WorkoutSessionDatasource {
  constructor(private readonly supabase: SupabaseService) {}

  async create(session: Omit<WorkoutSessionModel, 'id'>) {
    return this.supabase.client
      .from('workout_sessions')
      .insert(session)
      .select()
      .single();
  }

  async findAllByUserId(userId: string) {
    return this.supabase.client
      .from('workout_sessions')
      .select('*, workout:workouts(*)')
      .eq('user_id', userId)
      .order('started_at', { ascending: false });
  }

  async updateByIdAndUserId(
    id: string,
    userId: string,
    changes: Partial<
      Pick<WorkoutSessionModel, 'finished_at' | 'calories_burned'>
    >,
  ) {
    return this.supabase.client
      .from('workout_sessions')
      .update(changes)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .maybeSingle();
  }
}
