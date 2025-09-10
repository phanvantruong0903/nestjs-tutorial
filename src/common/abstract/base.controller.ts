import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BaseService } from './base.service';

export abstract class BaseController<T, CreateDto, UpdateDto> {
  constructor(
    protected readonly service: BaseService<T, CreateDto, UpdateDto>,
  ) {}

  @Post()
  create(@Body() createDto: CreateDto) {
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

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove() {
    return 'Method not implemented.'; // Placeholder implementation
  }
}
