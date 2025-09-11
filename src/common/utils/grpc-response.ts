import { BadRequestException } from '@nestjs/common';
import { ErrorResponse } from '../interface/api-response';

export function throwGrpcError(message: string, errors?: string[]): never {
  const errorResponse: ErrorResponse = { success: false, message, errors };
  throw new BadRequestException(errorResponse);
}

export function grpcResponse<T>(data: T, message = 'Success') {
  return {
    success: true,
    message,
    data,
  };
}
