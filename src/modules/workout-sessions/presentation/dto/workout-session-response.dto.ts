import { WorkoutSession } from '../../domain/entities/workout-session';

export class WorkoutSessionResponseDto {
  id: string;
  userId: string;
  workoutId: string;
  startedAt: string;
  finishedAt: string | null;
  caloriesBurned: number | null;

  static fromDomain(session: WorkoutSession): WorkoutSessionResponseDto {
    if (!session.id) {
      throw new Error('Cannot present a workout session without an id');
    }

    return {
      id: session.id,
      userId: session.userId,
      workoutId: session.workoutId,
      startedAt: session.startedAt,
      finishedAt: session.finishedAt,
      caloriesBurned: session.caloriesBurned,
    };
  }
}
