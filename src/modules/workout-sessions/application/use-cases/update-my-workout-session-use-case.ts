import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthUser } from '../../../auth/domain/entities/auth-user';
import { WorkoutSession } from '../../domain/entities/workout-session';
import { WorkoutSessionRepository } from '../../domain/repositories/workout-session.repository';

export type UpdateWorkoutSession = {
  finishedAt?: string;
  caloriesBurned?: number;
};

@Injectable()
export class UpdateMyWorkoutSessionUseCase {
  constructor(private readonly repository: WorkoutSessionRepository) {}

  async execute(
    user: AuthUser,
    id: string,
    changes: UpdateWorkoutSession,
  ): Promise<WorkoutSession> {
    if (user.role !== 'user') {
      throw new ForbiddenException('Only users can update workout sessions');
    }

    if (
      changes.finishedAt === undefined &&
      changes.caloriesBurned === undefined
    ) {
      throw new BadRequestException('No workout session changes provided');
    }

    const session = await this.repository.updateByIdAndUserId(
      id,
      user.id,
      changes,
    );

    if (!session) {
      throw new NotFoundException(`Workout session ${id} not found`);
    }

    return session;
  }
}
