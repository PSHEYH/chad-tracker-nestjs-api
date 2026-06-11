import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../../auth/presentation/guards/auth.guard';
import { CreateWorkoutUseCase } from '../../application/use-cases/create-workout-use-case';
import { FindAllWorkoutsUseCase } from '../../application/use-cases/find-all-workouts-use-case';
import { FindWorkoutByIdUseCase } from '../../application/use-cases/find-workout-by-id-use-case';
import { CreateWorkoutRequestDto } from '../dto/create-workout-request.dto';
import { WorkoutResponseDto } from '../dto/workout-response.dto';

@Controller('workouts')
@UseGuards(AuthGuard)
export class WorkoutController {
  constructor(
    private readonly createWorkout: CreateWorkoutUseCase,
    private readonly findAllWorkouts: FindAllWorkoutsUseCase,
    private readonly findWorkoutById: FindWorkoutByIdUseCase,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateWorkoutRequestDto,
  ): Promise<WorkoutResponseDto> {
    const workout = await this.createWorkout.execute(dto);

    return WorkoutResponseDto.fromDomain(workout);
  }

  @Get()
  async findAll(): Promise<WorkoutResponseDto[]> {
    const workouts = await this.findAllWorkouts.execute();

    return workouts.map((workout) => WorkoutResponseDto.fromDomain(workout));
  }

  @Get(':id')
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<WorkoutResponseDto> {
    const workout = await this.findWorkoutById.execute(id);

    if (!workout) {
      throw new NotFoundException(`Workout ${id} not found`);
    }

    return WorkoutResponseDto.fromDomain(workout);
  }
}
