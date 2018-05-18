import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CrudService } from './crud-service.interface';

export class CrudController<T> {
  constructor(private readonly crudService: CrudService<T>) {}

  @Post()
  public async create(@Body() entity: T): Promise<T> {
    return await this.crudService.create(entity);
  }

  @Get(':id')
  public async getOne(@Param('id') id: string): Promise<T> {
    return await this.crudService.getOne(parseInt(id, 10));
  }

  @Get()
  public async getAll(): Promise<T[]> {
    return await this.crudService.getAll();
  }

  @Put(':id')
  public async update(@Param('id') id: string, @Body() entity: T): Promise<T> {
    return await this.crudService.update(parseInt(id, 10), entity);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string) {
    return await this.crudService.delete(parseInt(id, 10));
  }
}
