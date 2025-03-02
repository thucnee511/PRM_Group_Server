import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemBaseResponse, ListBaseResponse } from 'src/common/base';
import { Cart, Order, User, UserRole } from 'src/common/models';
import { Like, Not, Repository } from 'typeorm';
import { UpdateUserRequestDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async search(
    keyword: string,
    page: number,
    size: number,
  ): Promise<ListBaseResponse<User>> {
    const [data, total] = await this.userRepository.findAndCount({
      where: [
        {
          fullname: keyword ? Like(`%${keyword}%`) : undefined,
          role: Not(UserRole.ADMIN),
          isDeleted: false,
        },
        {
          phoneNumber: keyword ? Like(`%${keyword}%`) : undefined,
          role: Not(UserRole.ADMIN),
          isDeleted: false,
        },
        {
          email: keyword ? Like(`%${keyword}%`) : undefined,
          role: Not(UserRole.ADMIN),
          isDeleted: false,
        },
      ],
      take: size,
      skip: (page - 1) * size,
    });
    const totalPage = Math.ceil(total / size);
    return {
      status: HttpStatus.OK,
      message: 'Data has been retrieved successfully',
      page,
      size,
      totalPage,
      totalSize: total,
      data,
    };
  }

  async findById(id: string): Promise<ItemBaseResponse<User>> {
    const data = await this.userRepository.findOneBy({ id });
    return {
      message: 'Data has been retrieved successfully',
      status: HttpStatus.OK,
      data,
    };
  }

  async update(
    id: string,
    updateUserRequestDto: UpdateUserRequestDto,
    loginUser: User,
  ): Promise<ItemBaseResponse<User>> {
    const data = await this.userRepository.findOneBy({ id });
    if (!data) throw new NotFoundException('Data not found');
    if (loginUser.role !== UserRole.ADMIN && loginUser.id !== data.id)
      throw new ForbiddenException('You are not allowed to access this data');
    data.fullname = updateUserRequestDto.fullname || data.fullname;
    data.phoneNumber = updateUserRequestDto.phoneNumber || data.phoneNumber;
    data.avatar = updateUserRequestDto.avatar || data.avatar;
    await this.userRepository.save(data);
    return {
      message: 'Data has been updated successfully',
      status: HttpStatus.OK,
      data,
    };
  }

  async delete(id: string, loginUser: User): Promise<ItemBaseResponse<User>> {
    const data = await this.userRepository.findOneBy({ id });
    if (!data) throw new NotFoundException('Data not found');
    if (loginUser.role !== UserRole.ADMIN && loginUser.id !== data.id)
      throw new ForbiddenException('You are not allowed to access this data');
    if (data.isDeleted) throw new BadRequestException('This user has been deleted already');
    data.isDeleted = true;
    await this.userRepository.save(data);
    return {
      message: 'Data has been deleted successfully',
      status: HttpStatus.OK,
      data,
    };
  }

  async findOrdersByUserId(
    id: string,
    page: number,
    size: number,
  ): Promise<ListBaseResponse<Order>> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('Userid not found');
    const [data, total] = await this.orderRepository.findAndCount({
      relations: {
        orderItems: true,
      },
      where: {
        userId: id,
      },
      skip: (page - 1) * size,
      take: size,
    });
    const totalPage = Math.ceil(total / size);
    return {
      status: HttpStatus.OK,
      message: 'Data has been retrieved successfully',
      page,
      size,
      totalPage,
      totalSize: total,
      data,
    };
  }

  async findOrderById(
    id: string,
    orderId: string,
  ): Promise<ItemBaseResponse<Order>> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('Userid not found');
    const data = await this.orderRepository.findOne({
      relations: {
        orderItems: true,
      },
      where: { id: orderId, userId: id },
    });
    if (!data) throw new NotFoundException('Orderid not found');
    return {
      status: HttpStatus.OK,
      message: 'Data has been retrieved successfully',
      data,
    };
  }
}
