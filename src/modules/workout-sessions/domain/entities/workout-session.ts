export class WorkoutSession {
  constructor(
    public readonly id: string | null,
    public readonly userId: string,
    public readonly workoutId: string,
    public readonly startedAt: string,
    public readonly finishedAt: string | null,
    public readonly caloriesBurned: number | null,
  ) {}
}
