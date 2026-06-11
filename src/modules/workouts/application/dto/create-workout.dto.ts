import { WorkoutDifficulty } from '../../domain/entities/workout-difficulty.enum';

export class CreateWorkoutDto {
  title: string;

  description: string;

  durationSeconds: number;

  calories: number;

  difficulty: WorkoutDifficulty;
}
