import { IsEnum, IsInt, IsString, MaxLength, Min } from 'class-validator';
import { CreateWorkoutDto } from '../../application/dto/create-workout.dto';
import { WorkoutDifficulty } from '../../domain/entities/workout-difficulty.enum';

export class CreateWorkoutRequestDto implements CreateWorkoutDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsString()
  @MaxLength(1000)
  description: string;

  @IsInt()
  @Min(1)
  durationSeconds: number;

  @IsInt()
  @Min(1)
  calories: number;

  @IsEnum(WorkoutDifficulty)
  difficulty: WorkoutDifficulty;
}
