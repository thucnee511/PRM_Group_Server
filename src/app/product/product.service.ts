import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListBaseResponse } from 'src/common/base';
import { Category, Product } from 'src/common/models';
import { Between, Like, Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(
    page: number,
    size: number,
    keyword: string,
    minPrice: number,
    maxPrice: number,
    categoryId: string,
    order: number,
  ): Promise<ListBaseResponse<Product>> {
    if (categoryId) {
      const category = await this.categoryRepository.findOne({
        where: {
          id: categoryId,
        },
      });
      if (!category) throw new NotFoundException('Category not found');
    }
    const [products, total] = await this.productRepository.findAndCount({
      where: {
        name: keyword ? Like(`%${keyword}%`) : undefined,
        brand: keyword ? Like(`%${keyword}%`) : undefined,
        categoryId: categoryId ? categoryId : undefined,
        price:
          minPrice && maxPrice
            ? Between(minPrice, maxPrice)
            : minPrice
            ? Between(minPrice, Number.MAX_SAFE_INTEGER)
            : maxPrice
            ? Between(0, maxPrice)
            : undefined,
      },
      order:
        order == 1
          ? { price: 'ASC' }
          : order == 2
          ? { price: 'DESC' }
          : order == 3
          ? { name: 'ASC' }
          : order == 4
          ? { name: 'DESC' }
          : { createdAt: 'DESC' },
      take: size,
      skip: (page - 1) * size,
    });
    const totalPages = Math.ceil(total / size);
    return {
      status: HttpStatus.OK,
      message: 'Data has been retrieved successfully',
      page: page,
      size: size,
      totalSize: total,
      totalPage: totalPages,
      data: products,
    };
  }
}
