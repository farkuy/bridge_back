import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findById(id: number) {
    return await this.findOne({ where: { id }, relations: ['roles'] });
  }

  async findByEmail(email: string) {
    return await this.findOne({ where: { email }, relations: ['roles'] });
  }

  async findAll() {
    return await this.find({ relations: ['roles'] });
  }

  async createUser(userDto: CreateUserDto) {
    return this.create(userDto);
  }
}
