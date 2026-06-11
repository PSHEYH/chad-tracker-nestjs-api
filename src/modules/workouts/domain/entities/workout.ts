import { WorkoutDifficulty } from './workout-difficulty.enum';

export class Workout {
  constructor(
    public readonly id: string | null,
    public readonly title: string,
    public readonly description: string,
    public readonly durationSeconds: number,
    public readonly calories: number,
    public readonly difficulty: WorkoutDifficulty,
  ) {}
}
