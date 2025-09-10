import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { BaseService } from 'src/common/base/base.service';
import { CreateUserDto } from '../users/dto/CreateUserDto';
import { UpdateUserDto } from '../users/dto/UpdateUserDto';
import { prisma } from 'src/config/prisma';

@Injectable()
export class AuthService extends BaseService<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  protected readonly model = prisma.user;

  getAuth(): string {
    return 'Get Auth Successfully';
  }
}
