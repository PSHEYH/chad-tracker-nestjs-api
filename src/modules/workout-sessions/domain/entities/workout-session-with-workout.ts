import { Workout } from '../../../workouts/domain/entities/workout';
import { WorkoutSession } from './workout-session';

export class WorkoutSessionWithWorkout {
  constructor(
    public readonly session: WorkoutSession,
    public readonly workout: Workout,
  ) {}
}
