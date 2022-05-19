import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../typeorm/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private readonly users: UserDto[] = [];

  async findOne(username: string) {
    return await this.userRepository.findOne({ username: username });
  }

  async create(userDto: UserDto) {
    const newUser = this.userRepository.create(userDto);
    return await this.userRepository.save(newUser);
  }

  async findOneOrCreate(userDto: UserDto) {
    let user = await this.userRepository.findOne({
      username: userDto.username,
    });

    if (!user) {
      user = await this.create(userDto);
    }

    return user;
  }

  async findAll() {
    const ret = await this.userRepository.query('SELECT * FROM users;');
    return ret;
  }

  async delete(username: string) {
    return await this.userRepository.delete({ username: username });
  }
}
