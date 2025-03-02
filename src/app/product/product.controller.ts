import { Controller, DefaultValuePipe, Get, ParseIntPipe, ParseUUIDPipe, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ProductService } from "./product.service";

@Controller('product')
@ApiTags('Product')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) {}

    @Get()
    @ApiOperation({ summary: 'Get all products' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'size', required: false })
    @ApiQuery({ name: 'keyword', required: false })
    @ApiQuery({ name: 'minPrice', required: false })
    @ApiQuery({ name: 'maxPrice', required: false })
    @ApiQuery({ name: 'categoryId', required: false })
    @ApiQuery({ name: 'order', required: false })
    async findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
        @Query('keyword') keyword: string,
        @Query('minPrice', new DefaultValuePipe(0), ParseIntPipe) minPrice: number,
        @Query('maxPrice', new DefaultValuePipe(0), ParseIntPipe) maxPrice: number,
        @Query('categoryId') categoryId: string,
        @Query('order', new DefaultValuePipe(0), ParseIntPipe) order: number,
    ) {
        return this.productService.findAll(page, size, keyword, minPrice, maxPrice, categoryId, order);
    }
}