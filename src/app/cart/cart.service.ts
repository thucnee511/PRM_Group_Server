import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemBaseResponse, ListBaseResponse } from 'src/common/base';
import { Cart, CartItem, Product, User } from 'src/common/models';
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
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
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
      return {
        status: HttpStatus.OK,
        message: 'Get cart successfully',
        data: await this.cartRepository.findOne({ where: { userId: userId } }),
      };
    }
    return {
      status: HttpStatus.OK,
      message: 'Get cart successfully',
      data: cart,
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

  async addCartItem(
    cartId: string,
    productId: string,
    quantity: number,
    user: User,
  ): Promise<ItemBaseResponse<CartItem>> {
    cartId =
      (await this.cartRepository.findOne({ where: { id: cartId } })).id ||
      (await this.getCart(user.id)).data.id;
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
    });
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');
    const cartItem = await this.cartItemRepository.findOne({
      where: { cartId, productId },
    });
    if (cartItem) {
      cartItem.quantity += quantity;
      await this.cartItemRepository.save(cartItem);
    } else {
      const newCartItem = new CartItem();
      newCartItem.cartId = cartId;
      newCartItem.productId = productId;
      newCartItem.quantity = quantity;
      newCartItem.price = product.price;
      await this.cartItemRepository.insert(newCartItem);
    }
    cart.totalItems += quantity;
    cart.totalValue += product.price * quantity;
    await this.cartRepository.save(cart);
    return {
      status: HttpStatus.OK,
      message: 'Add cart item successfully',
      data: await this.cartItemRepository.findOne({
        where: { cartId, productId },
      }),
    };
  }

  async updateCartItem(
    cartId: string,
    productId: string,
    quantity: number,
  ): Promise<ItemBaseResponse<CartItem>> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
    });
    if (!cart) throw new NotFoundException('Cart not found');
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');
    const cartItem = await this.cartItemRepository.findOne({
      where: { cartId, productId },
    });
    if (!cartItem) throw new NotFoundException('Cart item not found');
    cart.totalItems += quantity - cartItem.quantity;
    cart.totalValue += product.price * (quantity - cartItem.quantity);
    cartItem.quantity = quantity;
    await this.cartItemRepository.save(cartItem);
    await this.cartRepository.save(cart);
    return {
      status: HttpStatus.OK,
      message: 'Update cart item successfully',
      data: cartItem,
    };
  }

  async deleteCartItem(cartId: string, productId: string): Promise<ItemBaseResponse<CartItem>> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
    });
    if (!cart) throw new NotFoundException('Cart not found');
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');
    const cartItem = await this.cartItemRepository.findOne({
      where: { cartId, productId },
    });
    if (!cartItem) throw new NotFoundException('Cart item not found');
    cart.totalItems -= cartItem.quantity;
    cart.totalValue -= product.price * cartItem.quantity;
    await this.cartItemRepository.delete({ cartId, productId });
    await this.cartRepository.save(cart);
    return {
      status: HttpStatus.OK,
      message: 'Delete cart item successfully',
      data: cartItem,
    };
  }
}
