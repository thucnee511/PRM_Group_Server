import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemBaseResponse, ListBaseResponse } from 'src/common/base';
import { Cart, CartItem, User } from 'src/common/models';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getCart(userId: string): Promise<ItemBaseResponse<Cart>> {
    const user = this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const cart = await this.cartRepository.findOne({
      where: { userId: userId },
    });
    if (!cart) {
      const newCart = new Cart();
      newCart.userId = userId;
      await this.cartRepository.insert(newCart);
    }
    return {
      status: HttpStatus.OK,
      message: 'Get cart successfully',
      data: cart
        ? cart
        : await this.cartRepository.findOne({ where: { userId: userId } }),
    };
  }

  async getCartItems(
    page: number,
    size: number,
    cartId: string,
    user: User,
  ): Promise<ListBaseResponse<CartItem>> {
    cartId =
      (await this.cartRepository.findOne({ where: { id: cartId } })).id ||
      (await this.getCart(user.id)).data.id;
    const [cartItems, total] = await this.cartItemRepository.findAndCount({
      where: { cartId: cartId },
      take: size,
      skip: (page - 1) * size,
    });
    return {
      status: HttpStatus.OK,
      message: 'Get cart items successfully',
      page: page,
      size: size,
      totalPage: Math.ceil(total / size),
      totalSize: total,
      data: cartItems,
    };
  }
}
