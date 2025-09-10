import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status: number;
    let messages: string[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res: any = exception.getResponse();

      if (typeof res === 'string') {
        messages = [res];
      } else if (res && res.errors) {
        messages = res.errors;
      } else {
        messages = [res.message || exception.message];
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      status = HttpStatus.BAD_REQUEST;
      if (exception.code === 'P2002') {
        messages = [`${exception.meta?.target} đã tồn tại`];
      } else {
        messages = ['Dữ liệu không hợp lệ'];
      }
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      messages = ['Dữ liệu không hợp lệ'];
    }
    // Lỗi khác
    else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      messages = [exception.message || 'Internal server error'];
    }

    response.status(status).json({
      success: false,
      message: messages.join(', '),
      errors: messages,
    });
  }
}
