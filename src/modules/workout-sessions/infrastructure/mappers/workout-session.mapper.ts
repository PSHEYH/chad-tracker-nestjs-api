import { WorkoutSession } from '../../domain/entities/workout-session';
import { WorkoutSessionWithWorkout } from '../../domain/entities/workout-session-with-workout';
import { WorkoutMapper } from '../../../workouts/infrastructure/mappers/workout.mapper';
import { WorkoutSessionModel } from '../models/workout-session.model';
import { WorkoutSessionWithWorkoutModel } from '../models/workout-session-with-workout.model';

export class WorkoutSessionMapper {
  static toDomain(model: WorkoutSessionModel): WorkoutSession {
    return new WorkoutSession(
      model.id,
      model.user_id,
      model.workout_id,
      model.started_at,
      model.finished_at,
      model.calories_burned,
    );
  }

  static toPersistence(
    session: WorkoutSession,
  ): Omit<WorkoutSessionModel, 'id'> {
    return {
      user_id: session.userId,
      workout_id: session.workoutId,
      started_at: session.startedAt,
      finished_at: session.finishedAt,
      calories_burned: session.caloriesBurned,
    };
  }

  static toDomainWithWorkout(
    model: WorkoutSessionWithWorkoutModel,
  ): WorkoutSessionWithWorkout {
    return new WorkoutSessionWithWorkout(
      this.toDomain(model),
      WorkoutMapper.toDomain(model.workout),
    );
  }
}
