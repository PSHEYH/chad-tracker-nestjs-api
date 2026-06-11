import { WorkoutResponseDto } from '../../../workouts/presentation/dto/workout-response.dto';
import { WorkoutSessionWithWorkout } from '../../domain/entities/workout-session-with-workout';

export class WorkoutSessionWithWorkoutResponseDto {
  id: string;
  userId: string;
  workout: WorkoutResponseDto;
  startedAt: string;
  finishedAt: string | null;
  caloriesBurned: number | null;

  static fromDomain(
    sessionWithWorkout: WorkoutSessionWithWorkout,
  ): WorkoutSessionWithWorkoutResponseDto {
    const { session, workout } = sessionWithWorkout;

    if (!session.id) {
      throw new Error('Cannot present a workout session without an id');
    }

    return {
      id: session.id,
      userId: session.userId,
      workout: WorkoutResponseDto.fromDomain(workout),
      startedAt: session.startedAt,
      finishedAt: session.finishedAt,
      caloriesBurned: session.caloriesBurned,
    };
  }
}
