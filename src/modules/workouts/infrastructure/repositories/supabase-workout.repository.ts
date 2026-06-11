import { Injectable } from '@nestjs/common';
import { Workout } from '../../domain/entities/workout';
import { WorkoutRepository } from '../../domain/repositories/workout.repository';
import { WorkoutDatasource } from '../databases/workout.database';
import { WorkoutMapper } from '../mappers/workout.mapper';

@Injectable()
export class SupabaseWorkoutRepository implements WorkoutRepository {
  constructor(private readonly dataSource: WorkoutDatasource) {}

  async findById(id: string): Promise<Workout | null> {
    const { data, error } = await this.dataSource.findById(id);

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return WorkoutMapper.toDomain(data);
  }

  async create(workout: Workout): Promise<Workout> {
    const { data, error } = await this.dataSource.create(
      WorkoutMapper.toPersistence(workout),
    );

    if (error) {
      throw error;
    }

    return WorkoutMapper.toDomain(data);
  }

  async findAll(): Promise<Workout[]> {
    const { data, error } = await this.dataSource.findAll();

    if (error) {
      throw error;
    }

    return data?.map((workout) => WorkoutMapper.toDomain(workout)) ?? [];
  }
}
