import { Injectable } from '@nestjs/common';
import { Workout } from '../../domain/entities/workout';
import { WorkoutRepository } from '../../domain/repositories/workout.repository';
import { CreateWorkoutDto } from '../dto/create-workout.dto';

@Injectable()
export class CreateWorkoutUseCase {
  constructor(private readonly repository: WorkoutRepository) {}

  async execute(dto: CreateWorkoutDto): Promise<Workout> {
    const workout = new Workout(
      null,
      dto.title,
      dto.description,
      dto.durationSeconds,
      dto.calories,
      dto.difficulty,
    );

    return this.repository.create(workout);
  }
}
