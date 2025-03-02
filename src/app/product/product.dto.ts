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