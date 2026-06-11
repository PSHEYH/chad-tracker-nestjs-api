import { WorkoutModel } from '../../../workouts/infrastructure/models/workout.model';
import { WorkoutSessionModel } from './workout-session.model';

export type WorkoutSessionWithWorkoutModel = WorkoutSessionModel & {
  workout: WorkoutModel;
};
