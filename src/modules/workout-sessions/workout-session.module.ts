import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CreateWorkoutSessionUseCase } from './application/use-cases/create-workout-session-use-case';
import { FindMyWorkoutSessionsUseCase } from './application/use-cases/find-my-workout-sessions-use-case';
import { UpdateMyWorkoutSessionUseCase } from './application/use-cases/update-my-workout-session-use-case';
import { WorkoutSessionRepository } from './domain/repositories/workout-session.repository';
import { WorkoutSessionDatasource } from './infrastructure/databases/workout-session.database';
import { SupabaseWorkoutSessionRepository } from './infrastructure/repositories/supabase-workout-session.repository';
import { WorkoutSessionController } from './presentation/controllers/workout-session.controller';

@Module({
  imports: [AuthModule],
  controllers: [WorkoutSessionController],
  providers: [
    CreateWorkoutSessionUseCase,
    FindMyWorkoutSessionsUseCase,
    UpdateMyWorkoutSessionUseCase,
    WorkoutSessionDatasource,
    {
      provide: WorkoutSessionRepository,
      useClass: SupabaseWorkoutSessionRepository,
    },
  ],
})
export class WorkoutSessionModule {}
