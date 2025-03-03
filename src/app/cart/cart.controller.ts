import { ClassSerializerInterceptor, Controller, Get, UseGuards, UseInterceptors } from "@nestjs/common";
import { CartService } from "./cart.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthenticationGuard } from "src/common/guards";
import { LoginUser } from "src/common/decorators/loginuser.decorator";
import { Cart, User } from "src/common/models";
import { ItemBaseResponse } from "src/common/base";
import { RequestCartId } from "src/common/decorators/cart.decorator";

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

    @Get('items')
    @ApiOperation({ summary: 'Get cart items' })
    async getCartItems(@RequestCartId() cartId: string) : Promise<ItemBaseResponse<Cart>> {
        return null
    }
}