import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../../../infrastructure/supabase/supabase.service';
import { WorkoutModel } from '../models/workout.model';

@Injectable()
export class WorkoutDatasource {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll() {
    return this.supabase.client.from('workouts').select('*');
  }

  async findById(id: string) {
    return this.supabase.client
      .from('workouts')
      .select('*')
      .eq('id', id)
      .single();
  }

  async create(workout: Omit<WorkoutModel, 'id'>) {
    return this.supabase.client
      .from('workouts')
      .insert(workout)
      .select()
      .single();
  }
}
