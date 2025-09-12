import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ErrorResponse } from '../interface/api-response';

@Catch()
export class GrpcExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // ===== Validation lỗi từ ValidationPipe =====
    if (exception instanceof BadRequestException) {
      const res: any = exception.getResponse();
      const messages = Array.isArray(res.message) ? res.message : [res.message];

      const errorResponse: ErrorResponse = {
        success: false,
        message: 'Validation failed',
        errors: messages,
      };

      console.error('Validation Error:', JSON.stringify(errorResponse, null, 2));
      return errorResponse;
    }

    // ===== Trường hợp RpcException =====
    if (exception instanceof RpcException) {
      const error = exception.getError();

      let response: any;
      try {
        // Nếu error là string JSON thì parse
        if (typeof error === 'string') {
          response = JSON.parse(error);
        } else {
          response = error;
        }
      } catch (e) {
        response = {
          success: false,
          message: 'Invalid RpcException format',
          errors: [String(error)],
        };
      }

      console.error('RpcException:', JSON.stringify(response, null, 2));
      return response;
    }

    // ===== Các lỗi khác (Internal) =====
    const fallback = {
      success: false,
      message: 'Internal server error',
      errors: [exception.message || 'Unexpected error'],
    };

    console.error('Unknown Error:', JSON.stringify(fallback, null, 2));
    return fallback;
  }
}
