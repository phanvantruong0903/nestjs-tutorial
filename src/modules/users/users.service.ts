import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { BaseService } from 'src/common/abstract/base.service';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { prisma } from 'src/config/prisma';

@Injectable()
export class UserService extends BaseService<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor() {
    super(prisma.user);
  }
}
