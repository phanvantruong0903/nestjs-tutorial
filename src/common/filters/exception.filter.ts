import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';

@Catch()
export class GrpcExceptionFilter extends BaseRpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // Nếu bạn ném lỗi RpcException thì cứ để mặc định
    if (exception instanceof RpcException) {
      return super.catch(exception, host);
    }

    // Nếu là lỗi khác thì convert thành RpcException
    return super.catch(
      new RpcException(exception.message || 'Unknown error'),
      host,
    );
  }
}
