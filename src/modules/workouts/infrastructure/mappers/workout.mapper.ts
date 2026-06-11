import { Workout } from '../../domain/entities/workout';
import { WorkoutModel } from '../models/workout.model';

export class WorkoutMapper {
  static toDomain(model: WorkoutModel): Workout {
    return new Workout(
      model.id,
      model.title,
      model.description,
      model.durationSeconds,
      model.calories,
      model.difficulty,
    );
  }

  static toPersistence(workout: Workout): Omit<WorkoutModel, 'id'> {
    return {
      title: workout.title,
      description: workout.description,
      durationSeconds: workout.durationSeconds,
      calories: workout.calories,
      difficulty: workout.difficulty,
    };
  }
}
