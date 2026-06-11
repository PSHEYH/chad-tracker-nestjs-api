import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './infrastructure/supabase/supabase.module';
import { WorkoutModule } from './modules/workouts/workout.module';
import { AuthModule } from './modules/auth/auth.module';
import { WorkoutSessionModule } from './modules/workout-sessions/workout-session.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction =
          configService.get<string>('NODE_ENV') === 'production';

        return {
          pinoHttp: {
            level: isProduction ? 'info' : 'debug',
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    singleLine: true,
                    translateTime: 'SYS:standard',
                  },
                },
            redact: {
              paths: [
                'req.headers.authorization',
                'req.body.password',
                'res.headers["set-cookie"]',
                '*.accessToken',
                '*.refreshToken',
              ],
              censor: '[REDACTED]',
            },
            autoLogging: {
              ignore: (request) => request.url === '/',
            },
          },
        };
      },
    }),
    SupabaseModule,
    AuthModule,
    WorkoutModule,
    WorkoutSessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
