import { Injectable } from '@nestjs/common';
import { WorkoutSession } from '../../domain/entities/workout-session';
import { WorkoutSessionWithWorkout } from '../../domain/entities/workout-session-with-workout';
import { WorkoutSessionRepository } from '../../domain/repositories/workout-session.repository';
import { WorkoutSessionDatasource } from '../databases/workout-session.database';
import { WorkoutSessionMapper } from '../mappers/workout-session.mapper';

@Injectable()
export class SupabaseWorkoutSessionRepository implements WorkoutSessionRepository {
  constructor(private readonly datasource: WorkoutSessionDatasource) {}

  async create(session: WorkoutSession): Promise<WorkoutSession> {
    const { data, error } = await this.datasource.create(
      WorkoutSessionMapper.toPersistence(session),
    );

    if (error) {
      throw error;
    }

    return WorkoutSessionMapper.toDomain(data);
  }

  async findAllByUserId(userId: string): Promise<WorkoutSessionWithWorkout[]> {
    const { data, error } = await this.datasource.findAllByUserId(userId);

    if (error) {
      throw error;
    }

    return data.map((session) =>
      WorkoutSessionMapper.toDomainWithWorkout(session),
    );
  }

  async updateByIdAndUserId(
    id: string,
    userId: string,
    changes: {
      finishedAt?: string;
      caloriesBurned?: number;
    },
  ): Promise<WorkoutSession | null> {
    const persistenceChanges: {
      finished_at?: string;
      calories_burned?: number;
    } = {};

    if (changes.finishedAt !== undefined) {
      persistenceChanges.finished_at = changes.finishedAt;
    }

    if (changes.caloriesBurned !== undefined) {
      persistenceChanges.calories_burned = changes.caloriesBurned;
    }

    const { data, error } = await this.datasource.updateByIdAndUserId(
      id,
      userId,
      persistenceChanges,
    );

    if (error) {
      throw error;
    }

    return data ? WorkoutSessionMapper.toDomain(data) : null;
  }
}
