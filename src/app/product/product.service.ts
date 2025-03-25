import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemBaseResponse, ListBaseResponse } from 'src/common/base';
import { Brand, Category, Product, User } from 'src/common/models';
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
    user: User
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
        isDeleted: user ? user.role == 'admin' ? undefined : false : false,
      },
      order:
        order == 1
          ? { createdAt: 'DESC' } // Default: latest product
          : order == 2
          ? { createdAt: 'ASC' } // Oldest product
          : order == 3
          ? { price: 'ASC' } // Cheapest product
          : order == 4
          ? { price: 'DESC' } // Most expensive product
          : order == 5
          ? { name: 'ASC' } // A-Z
          : { name: 'DESC' }, // Z-A
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
    const data = this.productRepository.create({
      ...body,
    });
    await this.productRepository.save(data);
    return {
      status: HttpStatus.CREATED,
      message: 'Product has been created successfully',
      data: data
    };
  }

  async getOne(id: string, user: User): Promise<ItemBaseResponse<Product>> {
    const product = await this.productRepository.findOne({
      where: {
        id: id,
        isDeleted: user ? user.role == 'admin' ? undefined : false : false,
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
    await this.productRepository.update(
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

  async delete(id : string): Promise<ItemBaseResponse<Product>> {
    const product = await this.productRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    if (product.isDeleted) throw new NotFoundException('Product has been deleted already');
    this.productRepository.update(
      {
        id: id,
      },
      {
        isDeleted: true,
      },
    );
    return {
      status: HttpStatus.OK,
      message: 'Product has been deleted successfully',
      data: await this.productRepository.findOne({
        where: {
          id: id,
        },
      }),
    };
  }
}
