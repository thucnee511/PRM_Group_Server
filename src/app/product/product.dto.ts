import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsUUID } from "class-validator";

export class CreateProductRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    @IsInt()
    price: number;
    @ApiProperty()
    @IsInt()
    stock: number;
    @ApiProperty()
    imageUrl?: string;
    @ApiProperty()
    @IsUUID()
    categoryId: string;
    @ApiProperty()
    @IsUUID()
    brandId: string;
}

export class UpdateProductRequestDto {
    @ApiProperty()
    name?: string;
    @ApiProperty()
    description?: string;
    @ApiProperty()
    price?: number;
    @ApiProperty()
    stock?: number;
    @ApiProperty()
    imageUrl?: string;
    @ApiProperty()
    categoryId?: string;
    @ApiProperty()
    brandId?: string;
}