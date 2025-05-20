import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { AddRoleDto } from './dto/add-role.dto';
import { RolesService } from '../roles/roles.service';
import { UsersRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private rolesService: RolesService,
  ) {}

  async createUser(userDto: CreateUserDto) {
    const newUser = await this.usersRepository.createUser(userDto);

    const role = await this.rolesService.getRoleByValue('USER');
    newUser.roles = [role];

    await this.usersRepository.save(newUser);
    return newUser;
  }

  async getAllUsers() {
    return await this.usersRepository.findAll();
  }

  async addRole(addRoleDto: AddRoleDto) {
    const role = await this.rolesService.getRoleByValue(addRoleDto.value);
    const user = await this.usersRepository.findById(addRoleDto.userId);

    if (!user) throw new NotFoundException('Пользователь не найден');
    if (user.roles.find((activeRole) => activeRole.value === role.value)) {
      throw new NotFoundException('У пользователя имеется такая роль');
    }

    if (user.roles) user.roles.push(role);
    else user.roles = [role];

    await this.usersRepository.save(user);
    return user;
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('Пользователь не найден');

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new NotFoundException('Пользователь не найден');

    return user;
  }

  async isUserRegistration(email: string): Promise<boolean> {
    const user = await this.usersRepository.findByEmail(email);
    if (user)
      throw new NotFoundException('Пользователь с такой почтой существует');
    return false;
  }
}
