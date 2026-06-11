import { IsInt } from 'class-validator';

export class CreateWorkoutSessionRequestDto {
  @IsInt()
  workoutId: string;
}
