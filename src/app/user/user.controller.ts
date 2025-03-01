import {
    Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthenticationGuard, RoleGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';
import { Order, User, UserRole } from 'src/common/models';
import { ItemBaseResponse, ListBaseResponse } from 'src/common/base';
import { UpdateUserRequestDto } from './user.dto';
import { LoginUser } from 'src/common/decorators/loginuser.decorator';

@Controller('user')
@ApiTags('User')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthenticationGuard, RoleGuard)
@ApiBearerAuth()
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get()
    @ApiOperation({ summary: 'Find all users with name, phone or email' })
    @ApiQuery({ name: 'keyword', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'size', required: false })
    @Roles(UserRole.ADMIN)
    async search(
        @Query('keyword') keyword: string,
        @Query('page') page: number = 1,
        @Query('size') size: number = 10
    ) : Promise<ListBaseResponse<User>>{
        return await this.userService.search(keyword, page, size);
    }

    @Get(":id")
    @ApiOperation({ summary: 'Find user by id' })
    @Roles(UserRole.ADMIN)
    async findById(
        @Param('id', ParseUUIDPipe) id: string
    ) : Promise<ItemBaseResponse<User>> {
        return await this.userService.findById(id);
    }

    @Put(":id")
    @ApiOperation({ summary: 'Update user by id' })
    @Roles(UserRole.ADMIN, UserRole.USER)
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateUserRequestDto: UpdateUserRequestDto,
        @LoginUser() loginUser: User
    ) : Promise<ItemBaseResponse<User>> {
        return await this.userService.update(id, updateUserRequestDto, loginUser);
    }

    @Delete(":id")
    @ApiOperation({ summary: 'Delete user by id' })
    @Roles(UserRole.ADMIN, UserRole.USER)
    async delete(
        @Param('id', ParseUUIDPipe) id: string,
        @LoginUser() loginUser: User
    ) : Promise<ItemBaseResponse<User>> {
        return await this.userService.delete(id, loginUser);
    }

    @Get(":id/orders")
    @ApiOperation({ summary: 'Find all orders by user id' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'size', required: false })
    @Roles(UserRole.ADMIN)
    async findOrdersByUserId(
        @Param('id', ParseUUIDPipe) id: string,
        @Query('page') page: number = 1,
        @Query('size') size: number = 10
    ) : Promise<ListBaseResponse<Order>> {
        return await this.userService.findOrdersByUserId(id, page, size);
    }
}
