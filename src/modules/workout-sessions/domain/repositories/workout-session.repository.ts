import { WorkoutSession } from '../entities/workout-session';
import { WorkoutSessionWithWorkout } from '../entities/workout-session-with-workout';

export abstract class WorkoutSessionRepository {
  abstract create(session: WorkoutSession): Promise<WorkoutSession>;

  abstract findAllByUserId(
    userId: string,
  ): Promise<WorkoutSessionWithWorkout[]>;

  abstract updateByIdAndUserId(
    id: string,
    userId: string,
    changes: {
      finishedAt?: string;
      caloriesBurned?: number;
    },
  ): Promise<WorkoutSession | null>;
}
