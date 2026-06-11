import { Injectable } from '@nestjs/common';
import { Workout } from '../../domain/entities/workout';
import { WorkoutRepository } from '../../domain/repositories/workout.repository';

@Injectable()
export class FindWorkoutByIdUseCase {
  constructor(private readonly repository: WorkoutRepository) {}

  execute(id: string): Promise<Workout | null> {
    return this.repository.findById(id);
  }
}
