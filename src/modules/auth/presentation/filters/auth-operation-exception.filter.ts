import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthOperationError } from '../../application/errors/auth-operation.error';

@Catch(AuthOperationError)
export class AuthOperationExceptionFilter implements ExceptionFilter {
  catch(exception: AuthOperationError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const status =
      exception.status >= 400 && exception.status < 600
        ? exception.status
        : HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
