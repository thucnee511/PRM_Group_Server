import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderRequestDTO {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    totalItems: number;

    @ApiProperty()
    totalValue: number;

    }

    export class CreateOrderItemRequestDTO {
        @ApiProperty()
        productId: string;

        @ApiProperty()
        quantity: number;

        @ApiProperty()
        price
    }