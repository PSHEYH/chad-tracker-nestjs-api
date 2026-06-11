import { WorkoutSession } from '../../domain/entities/workout-session';
import { WorkoutSessionWithWorkout } from '../../domain/entities/workout-session-with-workout';
import { Workout } from '../../../workouts/domain/entities/workout';
import { WorkoutDifficulty } from '../../../workouts/domain/entities/workout-difficulty.enum';
import { WorkoutSessionWithWorkoutResponseDto } from './workout-session-with-workout-response.dto';

describe('WorkoutSessionWithWorkoutResponseDto', () => {
  it('returns the workout object instead of workoutId', () => {
    const response = WorkoutSessionWithWorkoutResponseDto.fromDomain(
      new WorkoutSessionWithWorkout(
        new WorkoutSession(
          '13c38385-b596-4165-bb44-fc6813f6656a',
          '9060cc95-1705-4f3f-9673-efabb08b2369',
          '7bddf048-79a5-4754-82ef-024b2079c749',
          '2026-06-08T10:00:00.000Z',
          null,
          null,
        ),
        new Workout(
          '7bddf048-79a5-4754-82ef-024b2079c749',
          'Morning workout',
          'Full body workout',
          1800,
          300,
          WorkoutDifficulty.EASY,
        ),
      ),
    );

    expect(response.workout.id).toBe('7bddf048-79a5-4754-82ef-024b2079c749');
    expect(response).not.toHaveProperty('workoutId');
  });
});
