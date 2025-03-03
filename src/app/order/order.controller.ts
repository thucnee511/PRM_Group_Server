import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query, UseGuards} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { OrderService } from "./order.service";
import { AuthenticationGuard, RoleGuard } from "src/common/guards";
import { UserRole } from "src/common/models";
import { Roles } from "src/common/decorators";
import { ParseDatePipe } from "src/common/pipes";

@Controller('orders')
@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(AuthenticationGuard, RoleGuard)
export class OrderController {
    constructor(
        private readonly orderService: OrderService
    ) {}

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
        @Query('fromDate', new DefaultValuePipe(new Date(0)), ParseDatePipe) fromDate: Date,
        @Query('toDate', new DefaultValuePipe(new Date()), ParseDatePipe) toDate: Date,
        @Query('orderType') orderType: string,
        @Query('productId') productId: string
    ) {
        return this.orderService.getAllOrders(page, size, userId, fromDate, toDate, orderType, productId);
    }
    
}