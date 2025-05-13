import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './roles.entity';
import { CreateRoleDto } from './dto/roles.dto';
import { User } from '../users/users.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createRole(roleDto: CreateRoleDto) {
    try {
      const newRole = await this.roleRepository.create(roleDto);
      await this.roleRepository.save(newRole);

      return newRole;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ошибка при создании роли',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRoleByValue(value: string) {
    try {
      const role = await this.roleRepository.findOne({ where: { value } });
      if (!role)
        throw new HttpException('Роль не найдена', HttpStatus.BAD_REQUEST);

      return role;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ошибка при получении роли',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
