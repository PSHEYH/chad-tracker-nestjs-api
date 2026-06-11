import { Injectable } from '@nestjs/common';
import { Workout } from '../../domain/entities/workout';
import { WorkoutRepository } from '../../domain/repositories/workout.repository';

@Injectable()
export class FindAllWorkoutsUseCase {
  constructor(private readonly repository: WorkoutRepository) {}

  execute(): Promise<Workout[]> {
    return this.repository.findAll();
  }
}
