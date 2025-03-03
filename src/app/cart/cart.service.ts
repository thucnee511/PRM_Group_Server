import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemBaseResponse } from 'src/common/base';
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
}
