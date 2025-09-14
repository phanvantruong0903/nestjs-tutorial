import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { BaseService } from 'src/common/abstract/base.service';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { prisma } from 'src/config/prisma';
import { LoginUserDto } from './dto/LoginUserDto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { USER_MESSAGES } from 'src/constants/messages';
import { throwGrpcError } from 'src/common/utils/grpc-response';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService extends BaseService<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor() {
    super(prisma.user);
  }

  async validateUser(data: LoginUserDto) {
    if (data) {
      const dtoInstance = plainToInstance(LoginUserDto, data);
      try {
        await validateOrReject(dtoInstance);
        const findUser = await prisma.user.findUnique({
          where: { email: dtoInstance.email },
        });

        if (!findUser) {
          throwGrpcError('Not Found', [USER_MESSAGES.NOT_FOUND]);
        }

        const isMatch = await bcrypt.compare(
          dtoInstance.password,
          findUser?.password,
        );

        if (!isMatch) {
          throwGrpcError('Not Found', [USER_MESSAGES.VALIDATION_FAILED]);
        }
      } catch (error) {
        throwGrpcError('Internal Server Error', [error?.message]);
      }
    }
  }
}
