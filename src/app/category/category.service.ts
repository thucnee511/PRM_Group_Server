import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemBaseResponse, ListBaseResponse } from 'src/common/base';
import { Category } from 'src/common/models';
import { Like, Repository } from 'typeorm';
import { CreateCategoryDto } from './category.dto';

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

  create(body: CreateCategoryDto): Promise<ItemBaseResponse<Category>> {
    const category = this.categoryRepository.create(body);
    return this.categoryRepository.save(category).then((data) => {
      return {
        status: 200,
        message: 'Data has been created successfully',
        data,
      };
    });
  }
}
