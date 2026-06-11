import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CreateWorkoutUseCase } from './application/use-cases/create-workout-use-case';
import { FindAllWorkoutsUseCase } from './application/use-cases/find-all-workouts-use-case';
import { FindWorkoutByIdUseCase } from './application/use-cases/find-workout-by-id-use-case';
import { WorkoutRepository } from './domain/repositories/workout.repository';
import { WorkoutDatasource } from './infrastructure/databases/workout.database';
import { SupabaseWorkoutRepository } from './infrastructure/repositories/supabase-workout.repository';
import { WorkoutController } from './presentation/controllers/workout.controller';

@Module({
  imports: [AuthModule],
  controllers: [WorkoutController],
  providers: [
    CreateWorkoutUseCase,
    FindAllWorkoutsUseCase,
    FindWorkoutByIdUseCase,
    WorkoutDatasource,
    {
      provide: WorkoutRepository,
      useClass: SupabaseWorkoutRepository,
    },
  ],
})
export class WorkoutModule {}
