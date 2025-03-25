import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './brand.dto';

@Controller('brand')
@ApiTags('Brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  async findAll() {
    return await this.brandService.findAll();
  }

    @Post()
    async create(@Body() body: CreateBrandDto) {
        return await this.brandService.create(body);
    }
}
