import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductRequestDto } from './product.dto';
import { ItemBaseResponse, ListBaseResponse } from 'src/common/base';
import { Product, User } from 'src/common/models';
import { LoginUser } from 'src/common/decorators/loginuser.decorator';

@Controller('product')
@ApiTags('Product')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'size', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'brandId', required: false })
  @ApiQuery({ name: 'order', required: false })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
    @Query('keyword') keyword: string,
    @Query('minPrice', new DefaultValuePipe(0), ParseIntPipe) minPrice: number,
    @Query('maxPrice', new DefaultValuePipe(0), ParseIntPipe) maxPrice: number,
    @Query('categoryId') categoryId: string,
    @Query('brandId') brandId: string,
    @Query('order', new DefaultValuePipe(0), ParseIntPipe) order: number,
    @LoginUser() user: User,
  ): Promise<ListBaseResponse<Product>> {
    return this.productService.findAll(
      page,
      size,
      keyword,
      minPrice,
      maxPrice,
      categoryId,
      brandId,
      order,
      user,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by id' })
  async findById(
    @Param('id') id: string,
    @LoginUser() user: User,
  ): Promise<ItemBaseResponse<Product>> {
    return this.productService.getOne(id, user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  async create(
    @Body() body: CreateProductRequestDto,
  ): Promise<ItemBaseResponse<Product>> {
    return this.productService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product by id' })
  async update(
    @Param('id') id: string,
    @Body() body: CreateProductRequestDto,
  ): Promise<ItemBaseResponse<Product>> {
    return this.productService.update(id, body);
  }
}
