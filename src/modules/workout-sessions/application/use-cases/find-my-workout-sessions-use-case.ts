import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthUser } from '../../../auth/domain/entities/auth-user';
import { WorkoutSessionWithWorkout } from '../../domain/entities/workout-session-with-workout';
import { WorkoutSessionRepository } from '../../domain/repositories/workout-session.repository';

@Injectable()
export class FindMyWorkoutSessionsUseCase {
  constructor(private readonly repository: WorkoutSessionRepository) {}

  async execute(user: AuthUser): Promise<WorkoutSessionWithWorkout[]> {
    if (user.role !== 'user') {
      throw new ForbiddenException('Only users can view workout sessions');
    }

    return this.repository.findAllByUserId(user.id);
  }
}
