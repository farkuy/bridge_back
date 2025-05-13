import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/user.dto';
import { AddRoleDto } from './dto/add-role.dto';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private rolesService: RolesService,
  ) {}

  async createUser(userDto: CreateUserDto) {
    try {
      const newUser = await this.usersRepository.create(userDto);

      const role = await this.rolesService.getRoleByValue('USER');
      newUser.roles = [role];

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

  async addRole(addRoleDto: AddRoleDto) {
    try {
      const role = await this.rolesService.getRoleByValue(addRoleDto.value);
      const user = await this.getUserById(addRoleDto.userId);
      if (
        user.roles &&
        user.roles.find((activeRole) => activeRole.value === role.value)
      )
        throw new HttpException(
          'У пользователя имеется такая роль',
          HttpStatus.BAD_REQUEST,
        );
      if (user.roles) user.roles.push(role);
      else user.roles = [role];

      await this.usersRepository.save(user);
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ошибка при добавлении роли пользователю',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserById(id: number) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: ['roles'],
      });
      if (!user)
        throw new HttpException(
          'Пользователь не найден',
          HttpStatus.BAD_REQUEST,
        );

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

  async getUserByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
        relations: ['roles'],
      });
      if (!user)
        throw new HttpException(
          'Пользователь не найден',
          HttpStatus.BAD_REQUEST,
        );

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
