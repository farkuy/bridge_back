import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(userDto: CreateUserDto) {
    try {
      const isReg = await this.usersRepository.findOne({
        where: { email: userDto.email },
      });
      if (isReg) {
        throw new HttpException(
          'Пользователь с такой почтной уже зарегестрирован',
          HttpStatus.FORBIDDEN,
        );
      }

      const newUser = await this.usersRepository.create(userDto);
      await this.usersRepository.save(newUser);

      return newUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ошибка при создании пользователя',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllUsers() {
    try {
      const users = await this.usersRepository.find();

      return users;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ошибка при создании пользователя',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      if (!user) {
        throw new HttpException(
          'Пользователь с такой почтной не найден',
          HttpStatus.NOT_FOUND,
        );
      }

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ошибка при поиске пользователя',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
