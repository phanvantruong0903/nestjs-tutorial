import { validateOrReject } from 'class-validator';
import { throwGrpcError } from '../utils/grpc-response';
import { BaseService } from './base.service';
import { plainToInstance } from 'class-transformer';

export class BaseGrpcHandler<
  T,
  CreateDto extends object,
  UpdateDto extends object,
> {
  constructor(
    protected readonly service: BaseService<T, CreateDto, UpdateDto>,
    private readonly createDtoClass?: new () => CreateDto,
    private readonly updateDtoClass?: new () => UpdateDto,
  ) {}

  async createLogic(dto: CreateDto): Promise<T> {
    if (this.createDtoClass) {
      const dtoInstance = plainToInstance(this.createDtoClass, dto as object);
      try {
        await validateOrReject(dtoInstance);
      } catch (errors) {
        const messages: string[] = (errors as any[]).map((err) =>
          Object.values(err.constraints ?? {}).join(', '),
        );

        throwGrpcError('Validation failed', messages);
      }
    }

    const result = await this.service.create(dto);
    return result;
  }

  async getAllLogic(): Promise<T[]> {
    return await this.service.findAll();
  }

  async getOneById(id: string): Promise<T | null> {
    return await this.service.findOne(id);
  }

  async updateLogic(id: string, dto: UpdateDto): Promise<T> {
    if (this.updateDtoClass) {
      const dtoInstance = plainToInstance(this.updateDtoClass, dto);
      try {
        await validateOrReject(dtoInstance);
      } catch (errors: any) {
        const messages: string[] = (errors as any[]).map((err) =>
          Object.values(err.constraints ?? {}).join(', '),
        );

        throwGrpcError('Validation failed', messages);
      }
    }
    return await this.service.update(id, dto);
  }
}
