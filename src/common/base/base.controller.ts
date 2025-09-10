import {
  BadRequestException,
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BaseService } from './base.service';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { ApiResponse } from './api-response';
import { USER_MESSAGES } from 'src/constants/messages';

export abstract class BaseController<
  T,
  CreateDto extends object,
  UpdateDto extends object,
> {
  constructor(
    protected readonly service: BaseService<T, CreateDto, UpdateDto>,
    private readonly createDtoClass?: new () => CreateDto,
    private readonly updateDtoClass?: new () => UpdateDto,
  ) {}

  @Post()
  async create(@Body() createDto: CreateDto): Promise<ApiResponse<T>> {
    if (this.createDtoClass) {
      const dtoInstance = plainToInstance(this.createDtoClass, createDto);
      try {
        await validateOrReject(dtoInstance);
      } catch (errors) {
        throw new BadRequestException({
          success: false,
          message: USER_MESSAGES.VALIDATION_ERROR,
          errors: errors.map((err: any) =>
            Object.values(err.constraints || {}).join(', '),
          ),
        });
      }
    }
    const data = await this.service.create(createDto);
    return {
      success: true,
      message: USER_MESSAGES.CREATE_SCUCCESS,
      data,
    };
  }

  @Get()
  async findAll(): Promise<ApiResponse<T[]>> {
    const data = await this.service.findAll();
    return {
      success: true,
      message: USER_MESSAGES.GET_ALL_SUCCESS,
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<T | null>> {
    const data = await this.service.findOne(id);
    return {
      success: true,
      message: USER_MESSAGES.GET_DETAIL_SUCCESS,
      data,
    };
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDto,
  ): Promise<ApiResponse<T>> {
    if (this.updateDtoClass) {
      const dtoInstance = plainToInstance(this.updateDtoClass, updateDto);

      try {
        await validateOrReject(dtoInstance);
      } catch (errors) {
        throw new BadRequestException({
          success: false,
          message: USER_MESSAGES.VALIDATION_ERROR,
          errors: errors.map((err: any) =>
            Object.values(err.constraints || {}).join(', '),
          ),
        });
      }
    }

    const data = await this.service.update(id, updateDto);
    return {
      success: true,
      message: USER_MESSAGES.UPDATE_SUCCESS,
      data,
    };
  }

  @Delete(':id')
  remove() {
    return this.service.remove();
  }
}
