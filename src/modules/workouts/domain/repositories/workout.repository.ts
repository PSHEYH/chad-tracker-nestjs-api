import { Workout } from '../entities/workout';

export abstract class WorkoutRepository {
  abstract findAll(): Promise<Workout[]>;

  abstract findById(id: string): Promise<Workout | null>;

  abstract create(workout: Workout): Promise<Workout>;
}
