import {
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CartService } from './cart.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/common/guards';
import { LoginUser } from 'src/common/decorators/loginuser.decorator';
import { Cart, CartItem, User } from 'src/common/models';
import { ItemBaseResponse, ListBaseResponse } from 'src/common/base';

@Controller('carts')
@ApiBearerAuth()
@ApiTags('Cart')
@UseGuards(AuthenticationGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get cart' })
  async getCart(@LoginUser() user: User): Promise<ItemBaseResponse<Cart>> {
    return await this.cartService.getCart(user.id);
  }

  @Get(':id/items')
  @ApiOperation({ summary: 'Get cart items' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'size', required: false })
  async getCartItems(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
    @Param('id', ParseUUIDPipe) cartId: string,
    @LoginUser() user: User,
  ): Promise<ListBaseResponse<CartItem>> {
    return await this.cartService.getCartItems(page, size, cartId, user);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Add product to cart' })
  async addItem(
    @Param('id', ParseUUIDPipe) cartId: string,
    @Query('productId', ParseUUIDPipe) productId: string,
    @Query('quantity', ParseIntPipe) quantity: number,
    @LoginUser() user: User,
  ): Promise<ItemBaseResponse<CartItem>> {
    return await this.cartService.addCartItem(
      cartId,
      productId,
      quantity,
      user,
    );
  }

  @Put(':id/items')
  @ApiOperation({ summary: 'Update cart item' })
  async updateItem(
    @Param('id', ParseUUIDPipe) cartId: string,
    @Query('productId', ParseUUIDPipe) productId: string,
    @Query('quantity', ParseIntPipe) quantity: number,
  ): Promise<ItemBaseResponse<CartItem>> {
    return await this.cartService.updateCartItem(cartId, productId, quantity);
  }
}
