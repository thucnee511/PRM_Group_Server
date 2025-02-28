import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemBaseResponse, ListBaseResponse } from 'src/common/base';
import { User, UserRole } from 'src/common/models';
import { Like, Repository } from 'typeorm';
import { UpdateUserRequestDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async search(
    keyword: string,
    page: number,
    size: number,
  ): Promise<ListBaseResponse<User>> {
    const [data, total] = await this.userRepository.findAndCount({
      where: [
        { fullname: keyword ? Like(`%${keyword}%`) : undefined },
        { phoneNumber: keyword ? Like(`%${keyword}%`) : undefined },
        { email: keyword ? Like(`%${keyword}%`) : undefined },
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
    const data = await this.userRepository.findOneBy({id});
    return {
      message: 'Data has been retrieved successfully',
      status: HttpStatus.OK,
      data,
    };
  }

  async update(id: string, updateUserRequestDto: UpdateUserRequestDto, loginUser : User): Promise<ItemBaseResponse<User>> {
    const data = await this.userRepository.findOneBy({id});
    if (!data) {
      return {
        message: 'Data not found',
        status: HttpStatus.NOT_FOUND,
        data: null,
      };
    }
    if (loginUser.role !== UserRole.ADMIN && loginUser.id !== data.id) {
      return {
        message: 'You are not authorized to perform this action',
        status: HttpStatus.FORBIDDEN,
        data: null,
      };
    }
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
}
