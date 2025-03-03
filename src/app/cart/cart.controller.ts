import { ClassSerializerInterceptor, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, ParseUUIDPipe, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { CartService } from "./cart.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthenticationGuard } from "src/common/guards";
import { LoginUser } from "src/common/decorators/loginuser.decorator";
import { Cart, CartItem, User } from "src/common/models";
import { ItemBaseResponse, ListBaseResponse } from "src/common/base";

@Controller('carts')
@ApiBearerAuth()
@ApiTags('Cart')
@UseGuards(AuthenticationGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    @ApiOperation({ summary: 'Get cart' })
    async getCart(@LoginUser() user : User) : Promise<ItemBaseResponse<Cart>> {
        return await this.cartService.getCart(user.id);
    }

    @Get(':id/items')
    @ApiOperation({ summary: 'Get cart items' })
    async getCartItems(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
        @Param('id', ParseUUIDPipe) cartId: string,
        @LoginUser() user: User,
    ) : Promise<ListBaseResponse<CartItem>> {
        return await this.cartService.getCartItems(page, size, cartId, user);
    }
}