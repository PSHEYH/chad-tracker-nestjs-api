import { Workout } from '../../domain/entities/workout';
import { WorkoutDifficulty } from '../../domain/entities/workout-difficulty.enum';

export class WorkoutResponseDto {
  id: string;
  title: string;
  description: string;
  durationSeconds: number;
  calories: number;
  difficulty: WorkoutDifficulty;

  static fromDomain(workout: Workout): WorkoutResponseDto {
    if (!workout.id) {
      throw new Error('Cannot present a workout without an id');
    }

    return {
      id: workout.id,
      title: workout.title,
      description: workout.description,
      durationSeconds: workout.durationSeconds,
      calories: workout.calories,
      difficulty: workout.difficulty,
    };
  }
}
