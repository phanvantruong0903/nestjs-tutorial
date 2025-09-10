export class BaseService<T, CreateDto, UpdateDto> {
  constructor(protected readonly model: any) {}

  create(dto: CreateDto): Promise<T> {
    return this.model.create({ data: dto });
  }

  findAll(): Promise<T[]> {
    return this.model.findMany();
  }

  findOne(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id: Number(id) } });
  }

  update(id: string, dto: UpdateDto): Promise<T> {
    return this.model.update({ where: { id: Number(id) }, data: dto });
  }

  remove(): Promise<string> {
    throw new Error('Method not implemented.');
  }
}
