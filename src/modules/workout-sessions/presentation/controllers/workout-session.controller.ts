import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { AuthGuard } from '../../../auth/presentation/guards/auth.guard';
import { AuthUser } from '../../../auth/domain/entities/auth-user';
import { CreateWorkoutSessionUseCase } from '../../application/use-cases/create-workout-session-use-case';
import { FindMyWorkoutSessionsUseCase } from '../../application/use-cases/find-my-workout-sessions-use-case';
import { UpdateMyWorkoutSessionUseCase } from '../../application/use-cases/update-my-workout-session-use-case';
import { CreateWorkoutSessionRequestDto } from '../dto/create-workout-session-request.dto';
import { UpdateWorkoutSessionRequestDto } from '../dto/update-workout-session-request.dto';
import { WorkoutSessionResponseDto } from '../dto/workout-session-response.dto';
import { WorkoutSessionWithWorkoutResponseDto } from '../dto/workout-session-with-workout-response.dto';

@Controller('workout-sessions')
@UseGuards(AuthGuard)
export class WorkoutSessionController {
  constructor(
    private readonly createSession: CreateWorkoutSessionUseCase,
    private readonly findMySessions: FindMyWorkoutSessionsUseCase,
    private readonly updateMySession: UpdateMyWorkoutSessionUseCase,
  ) {}

  @Post()
  async create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateWorkoutSessionRequestDto,
  ): Promise<WorkoutSessionResponseDto> {
    const session = await this.createSession.execute(user, dto.workoutId);

    return WorkoutSessionResponseDto.fromDomain(session);
  }

  @Get()
  async findMine(
    @CurrentUser() user: AuthUser,
  ): Promise<WorkoutSessionWithWorkoutResponseDto[]> {
    const sessions = await this.findMySessions.execute(user);

    return sessions.map((session) =>
      WorkoutSessionWithWorkoutResponseDto.fromDomain(session),
    );
  }

  @Patch(':id')
  async updateMine(
    @CurrentUser() user: AuthUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateWorkoutSessionRequestDto,
  ): Promise<WorkoutSessionResponseDto> {
    const session = await this.updateMySession.execute(user, id, dto);

    return WorkoutSessionResponseDto.fromDomain(session);
  }
}
