import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemBaseResponse, ListBaseResponse } from 'src/common/base';
import { Brand, Category } from 'src/common/models';
import { Repository } from 'typeorm';
import { CreateBrandDto } from './brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<ListBaseResponse<Brand>> {
    const [data, total] = await this.brandRepository.findAndCount({});
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

  async create(body: CreateBrandDto): Promise<ItemBaseResponse<Brand>> {
    const category = await this.categoryRepository.findOneBy({ id: body.categoryId });
    if (!category) throw new NotFoundException('Category not found');
    const brand = this.brandRepository.create(body);
    brand.category = category;
    return this.brandRepository.save(brand).then((data) => {
      return {
        status: 200,
        message: 'Data has been created successfully',
        data,
      };
    });
  }
}
