import { BaseController } from 'src/common/base/base.controller';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { Body, Controller } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './users.service';

@Controller('/v1/users')
export class UserController extends BaseController<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(private readonly userService: UserService) {
    super(userService, CreateUserDto, UpdateUserDto);
  }
}
