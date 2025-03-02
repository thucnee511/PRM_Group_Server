import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemBaseResponse, ListBaseResponse } from 'src/common/base';
import { Brand, Category, Product } from 'src/common/models';
import { Between, Like, Repository } from 'typeorm';
import { CreateProductRequestDto } from './product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async findAll(
    page: number,
    size: number,
    keyword: string,
    minPrice: number,
    maxPrice: number,
    categoryId: string,
    brandId: string,
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
    if (brandId) {
      const brand = await this.brandRepository.findOne({
        where: {
          id: brandId,
        },
      });
      if (!brand) throw new NotFoundException('Brand not found');
    }
    const [products, total] = await this.productRepository.findAndCount({
      relations: {
        category: categoryId ? true : false,
        brand: brandId ? true : false,
      },
      where: {
        name: keyword ? Like(`%${keyword}%`) : undefined,
        brand: brandId
          ? {
              name: keyword ? Like(`%${keyword}%`) : undefined,
            }
          : undefined,
        category: categoryId
          ? {
              name: keyword ? Like(`%${keyword}%`) : undefined,
            }
          : undefined,
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

  async create(
    body: CreateProductRequestDto,
  ): Promise<ItemBaseResponse<Product>> {
    const category = await this.categoryRepository.findOne({
      where: {
        id: body.categoryId,
      },
    });
    if (!category) throw new NotFoundException('Category not found');
    const brand = await this.brandRepository.findOne({
      where: {
        id: body.brandId,
      },
    });
    if (!brand) throw new NotFoundException('Brand not found');
    this.productRepository.create({
      ...body,
    });
    return {
      status: HttpStatus.CREATED,
      message: 'Product has been created successfully',
      data: await this.productRepository.findOne({
        where: {
          name: body.name,
        },
      }),
    };
  }

  async getOne(id: string): Promise<ItemBaseResponse<Product>> {
    const product = await this.productRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return {
      status: HttpStatus.OK,
      message: 'Data has been retrieved successfully',
      data: product,
    };
  }

  async update(
    id: string,
    body: CreateProductRequestDto,
  ): Promise<ItemBaseResponse<Product>> {
    if (body.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: {
          id: body.categoryId,
        },
      });
      if (!category) throw new NotFoundException('Category not found');
    }
    if (body.brandId) {
      const brand = await this.brandRepository.findOne({
        where: {
          id: body.brandId,
        },
      });
      if (!brand) throw new NotFoundException('Brand not found');
    }
    const product = await this.productRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    this.productRepository.update(
      {
        id: id,
      },
      {
        name: body.name ? body.name : product.name,
        price: body.price ? body.price : product.price,
        stock: body.stock ? body.stock : product.stock,
        imageUrl: body.imageUrl ? body.imageUrl : product.imageUrl,
        categoryId: body.categoryId ? body.categoryId : product.categoryId,
        brandId: body.brandId ? body.brandId : product.brandId,
      },
    );
    return {
      status: HttpStatus.OK,
      message: 'Product has been updated successfully',
      data: await this.productRepository.findOne({
        where: {
          id: id,
        },
      }),
    };
  }
}
