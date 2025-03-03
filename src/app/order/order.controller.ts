import {
  Controller,
  DefaultValuePipe,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { AuthenticationGuard, RoleGuard } from 'src/common/guards';
import { Order, User, UserRole } from 'src/common/models';
import { Roles } from 'src/common/decorators';
import { ParseDatePipe } from 'src/common/pipes';
import { LoginUser } from 'src/common/decorators/loginuser.decorator';
import { ItemBaseResponse } from 'src/common/base';

@Controller('orders')
@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(AuthenticationGuard, RoleGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'size', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'fromDate', required: false, type: Date })
  @ApiQuery({ name: 'toDate', required: false, type: Date })
  @ApiQuery({ name: 'orderType', required: false })
  @ApiQuery({ name: 'productId', required: false })
  async getAllOrders(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
    @Query('userId') userId: string,
    @Query('fromDate', new DefaultValuePipe(new Date(0)), ParseDatePipe)
    fromDate: Date,
    @Query('toDate', new DefaultValuePipe(new Date()), ParseDatePipe)
    toDate: Date,
    @Query('orderType') orderType: string,
    @Query('productId') productId: string,
    @LoginUser() user: User,
  ) {
    if (user.role === UserRole.USER) {
      if (userId && userId !== user.id) {
        throw new ForbiddenException(
          'You are not allowed to view other user orders',
        );
      }
      userId = user.id;
    }
    return this.orderService.getAllOrders(
      page,
      size,
      userId,
      fromDate,
      toDate,
      orderType,
      productId,
    );
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getOrderById(
    @Param('id') id: string,
    @LoginUser() user: User,
  ): Promise<ItemBaseResponse<Order>> {
    return await this.orderService.getOrderById(id, user);
  }

  @Post()
  @Roles(UserRole.USER)
  async createOrder(@LoginUser() user: User, @Query('cartId') cartId: string) {
    return await this.orderService.createOrder(user, cartId);
  }
}
