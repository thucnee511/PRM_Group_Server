import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/common/guards';
import { CategoryService } from './category.service';
import { Category } from 'src/common/models';
import { ItemBaseResponse, ListBaseResponse } from 'src/common/base';
import { CreateCategoryDto } from './category.dto';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  async findAll(): Promise<ListBaseResponse<Category>> {
    return await this.categoryService.findAll();
  }

  @Post()
  @UseGuards(AuthenticationGuard)
  @ApiOperation({ summary: 'Create new category' })
  async create(@Body() body: CreateCategoryDto): Promise<ItemBaseResponse<Category>> {
    return await this.categoryService.create(body);
  }
}
