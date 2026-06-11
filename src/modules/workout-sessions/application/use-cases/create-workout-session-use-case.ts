import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthUser } from '../../../auth/domain/entities/auth-user';
import { WorkoutSession } from '../../domain/entities/workout-session';
import { WorkoutSessionRepository } from '../../domain/repositories/workout-session.repository';

@Injectable()
export class CreateWorkoutSessionUseCase {
  constructor(private readonly repository: WorkoutSessionRepository) {}

  async execute(user: AuthUser, workoutId: string): Promise<WorkoutSession> {
    if (user.role !== 'user') {
      throw new ForbiddenException('Only users can create workout sessions');
    }

    return this.repository.create(
      new WorkoutSession(
        null,
        user.id,
        workoutId,
        new Date().toISOString(),
        null,
        null,
      ),
    );
  }
}
