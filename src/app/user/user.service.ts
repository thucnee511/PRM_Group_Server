import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemBaseResponse, ListBaseResponse } from 'src/common/base';
import { User } from 'src/common/models';
import { Like, Repository } from 'typeorm';

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
}
