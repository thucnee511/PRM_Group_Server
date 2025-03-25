import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './brand.dto';
import { AuthenticationGuard } from 'src/common/guards';

@Controller('brand')
@ApiTags('Brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  async findAll() {
    return await this.brandService.findAll();
  }

  @Post()
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  async create(@Body() body: CreateBrandDto) {
    return await this.brandService.create(body);
  }
}
