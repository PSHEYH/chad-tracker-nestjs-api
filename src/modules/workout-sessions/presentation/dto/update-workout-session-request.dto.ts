import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';
import { UpdateWorkoutSession } from '../../application/use-cases/update-my-workout-session-use-case';

export class UpdateWorkoutSessionRequestDto implements UpdateWorkoutSession {
  @IsOptional()
  @IsDateString()
  finishedAt?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  caloriesBurned?: number;
}
