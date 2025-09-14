import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { UsersGrpcController } from './users.grpc.controller';

@Module({
  imports: [],
  controllers: [UsersGrpcController],
  providers: [UserService],
})
export class UserModule {}
