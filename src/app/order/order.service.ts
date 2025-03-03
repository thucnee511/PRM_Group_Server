import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemBaseResponse, ListBaseResponse } from 'src/common/base';
import {
  Cart,
  CartItem,
  Order,
  OrderItem,
  Product,
  User,
  UserRole,
} from 'src/common/models';
import { Between, Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async getAllOrders(
    page: number,
    size: number,
    userId?: string,
    fromDate?: Date,
    toDate?: Date,
    orderType?: string,
    productId?: string,
  ): Promise<ListBaseResponse<Order>> {
    const [orders, total] = await this.orderRepository.findAndCount({
      relations: {
        orderItems: true,
      },
      where: {
        userId: userId ? userId : undefined,
        createdAt:
          fromDate && toDate
            ? Between(fromDate, toDate)
            : fromDate
            ? Between(fromDate, new Date())
            : toDate
            ? Between(new Date(0), toDate)
            : undefined,
        orderItems: {
          productId: productId ? productId : undefined,
        },
      },
      order: {
        createdAt: orderType === 'asc' ? 'ASC' : 'DESC',
      },
      take: size,
      skip: (page - 1) * size,
    });
    return {
      status: HttpStatus.OK,
      message: 'Orders fetched successfully',
      page,
      size,
      totalSize: total,
      totalPage: Math.ceil(total / size),
      data: orders,
    };
  }

  async getOrderById(id: string, user: User): Promise<ItemBaseResponse<Order>> {
    const order = await this.orderRepository.findOne({
      where: {
        id,
      },
      relations: {
        orderItems: true,
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (user.role === UserRole.USER && order.userId !== user.id)
      throw new ForbiddenException(
        'You are not allowed to view other user orders',
      );
    return {
      status: HttpStatus.OK,
      message: 'Order fetched successfully',
      data: order,
    };
  }

    async createOrder(user: User, cartId: string): Promise<ItemBaseResponse<Order>> {
        const cart = await this.cartRepository.findOne({
            where: {
                id: cartId,
                userId: user.id,
            },
            relations: {
                cartItems: true,
            },
        });
        if (!cart) throw new NotFoundException('Cart not found');
        const order = new Order();
        order.userId = user.id;
        order.totalItems = cart.totalItems;
        order.totalValue = cart.totalValue;
        const newOrder = await this.orderRepository.save(order);
        const orderItems = cart.cartItems.map((cartItem) => {
            const orderItem = new OrderItem();
            orderItem.orderId = newOrder.id;
            orderItem.productId = cartItem.productId;
            orderItem.quantity = cartItem.quantity;
            orderItem.price = cartItem.price;
            return orderItem;
        });
        await this.orderItemRepository.save(orderItems);
        await this.cartItemRepository.delete(cart.cartItems.map((cartItem) => cartItem.id));
        cart.totalItems = 0;
        cart.totalValue = 0;
        await this.cartRepository.save(cart);
        return {
            status: HttpStatus.CREATED,
            message: 'Order created successfully',
            data: newOrder,
        };
    } 
}
