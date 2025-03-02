import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/common/guards';
import { CategoryService } from './category.service';
import { Category } from 'src/common/models';
import { ListBaseResponse } from 'src/common/base';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  async findAll(): Promise<ListBaseResponse<Category>> {
    return await this.categoryService.findAll();
  }
}
