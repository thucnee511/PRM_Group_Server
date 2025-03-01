import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListBaseResponse } from 'src/common/base';
import { Category } from 'src/common/models';
import { Like, Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll() : Promise<ListBaseResponse<Category>> {
    const [data, total] = await this.categoryRepository.findAndCount({});
    return {
      status: 200,
      message: 'Data has been retrieved successfully',
      page: 1,
      size: total,
      totalPage: 1,
      totalSize: total,
      data,
    };
  }
}
