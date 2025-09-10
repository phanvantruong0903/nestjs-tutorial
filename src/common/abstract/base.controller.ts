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
  async create(@Body() createDto: CreateDto) {
    if (this.createDtoClass) {
      const dtoInstance = plainToInstance(this.createDtoClass, createDto);
      try {
        await validateOrReject(dtoInstance);
      } catch (errors) {
        throw new BadRequestException({
          success: false,
          message: 'Validation failed',
          errors: errors.map((err: any) =>
            Object.values(err.constraints || {}).join(', '),
          ),
        });
      }
    }
    return this.service.create(createDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateDto) {
    if (this.updateDtoClass) {
      const dtoInstance = plainToInstance(this.updateDtoClass, updateDto);

      try {
        await validateOrReject(dtoInstance);
      } catch (errors) {
        throw new BadRequestException({
          success: false,
          message: 'Validation failed',
          errors: errors.map((err: any) =>
            Object.values(err.constraints || {}).join(', '),
          ),
        });
      }
    }

    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove() {
    return this.service.remove();
  }
}
