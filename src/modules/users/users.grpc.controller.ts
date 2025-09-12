import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { BaseGrpcHandler } from 'src/common/abstract/base-grpc.handler';
import { grpcResponse } from 'src/common/utils/grpc-response';
import { User } from '@prisma/client';
import { BaseController } from 'src/common/abstract/base.controller';
import { USER_MESSAGES } from 'src/constants/messages';

@Controller()
export class UsersGrpcController extends BaseController<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  private readonly baseHandler: BaseGrpcHandler<
    User,
    CreateUserDto,
    UpdateUserDto
  >;

  constructor(private readonly userService: UserService) {
    super(userService, CreateUserDto, UpdateUserDto);
    this.baseHandler = new BaseGrpcHandler(
      this.userService,
      CreateUserDto,
      UpdateUserDto,
    );
  }

  @GrpcMethod('UserService', 'CreateUser')
  async createUser(data: CreateUserDto) {
    try {
      const result = await this.baseHandler.createLogic(data);
      return grpcResponse(result, USER_MESSAGES.CREATE_SCUCCESS);
    } catch (error) {
      throw new RpcException(error.message || USER_MESSAGES.CREATE_FAILED);
    }
  }

  @GrpcMethod('UserService', 'GetUser')
  async getUser({ id }: { id: string }) {
    const result = await this.baseHandler.getOneById(id);
    return grpcResponse(result, USER_MESSAGES.GET_DETAIL_SUCCESS);
  }

  @GrpcMethod('UserService', 'UpdateUser')
  async updateUser(data: UpdateUserDto & { id: string }) {
    const { id, ...updateData } = data;
    const result = await this.baseHandler.updateLogic(id, updateData);
    return grpcResponse(result, USER_MESSAGES.UPDATE_SUCCESS);
  }

  @GrpcMethod('UserService', 'GetAllUsers')
  async getAllUsers(_: {}) {
    const result = await this.baseHandler.getAllLogic();
    console.log(result);
    return grpcResponse(result, USER_MESSAGES.GET_ALL_SUCCESS);
  }
}
