import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { LoginUseCase } from '../../application/use-cases/login-use-case';
import { GoogleLoginUseCase } from '../../application/use-cases/google-login-use-case';
import { LogoutUseCase } from '../../application/use-cases/logout-use-case';
import { RefreshSessionUseCase } from '../../application/use-cases/refresh-session-use-case';
import { RegisterUseCase } from '../../application/use-cases/register-use-case';
import { AuthUser } from '../../domain/entities/auth-user';
import { CurrentAccessToken } from '../decorators/current-access-token.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { AuthCredentialsRequestDto } from '../dto/auth-credentials-request.dto';
import { GoogleLoginRequestDto } from '../dto/google-login-request.dto';
import { AuthResultResponseDto } from '../dto/auth-result-response.dto';
import { AuthUserResponseDto } from '../dto/auth-user-response.dto';
import { RefreshTokenRequestDto } from '../dto/refresh-token-request.dto';
import { AuthOperationExceptionFilter } from '../filters/auth-operation-exception.filter';
import { AuthGuard } from '../guards/auth.guard';
import { AuthRegisterRequestDto } from '../dto/auth-register-request.dto';

@Controller('auth')
@UseFilters(AuthOperationExceptionFilter)
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUseCase,
    private readonly loginUser: LoginUseCase,
    private readonly googleLogin: GoogleLoginUseCase,
    private readonly refreshSession: RefreshSessionUseCase,
    private readonly logoutUser: LogoutUseCase,
  ) {}

  @Post('register')
  async register(
    @Body() dto: AuthRegisterRequestDto,
  ): Promise<AuthResultResponseDto> {
    const result = await this.registerUser.execute(dto.email, dto.password);

    return AuthResultResponseDto.fromDomain(result);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  async loginWithGoogle(
    @Body() dto: GoogleLoginRequestDto,
  ): Promise<AuthResultResponseDto> {
    const result = await this.googleLogin.execute(dto.idToken);

    return AuthResultResponseDto.fromDomain(result);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: AuthCredentialsRequestDto,
  ): Promise<AuthResultResponseDto> {
    const result = await this.loginUser.execute(dto.email, dto.password);

    return AuthResultResponseDto.fromDomain(result);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() dto: RefreshTokenRequestDto,
  ): Promise<AuthResultResponseDto> {
    const result = await this.refreshSession.execute(dto.refreshToken);

    return AuthResultResponseDto.fromDomain(result);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  async logout(@CurrentAccessToken() accessToken: string): Promise<void> {
    await this.logoutUser.execute(accessToken);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@CurrentUser() user: AuthUser): AuthUserResponseDto {
    return AuthUserResponseDto.fromDomain(user);
  }
}
