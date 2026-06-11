import { WorkoutDifficulty } from '../../domain/entities/workout-difficulty.enum';

export interface WorkoutModel {
  id: string;
  title: string;
  description: string;
  durationSeconds: number;
  calories: number;
  difficulty: WorkoutDifficulty;
}
