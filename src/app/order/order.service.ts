import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListBaseResponse } from 'src/common/base';
import {
  Cart,
  CartItem,
  Order,
  OrderItem,
  Product,
  User,
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
        }
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
}
