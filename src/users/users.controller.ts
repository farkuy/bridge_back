import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { User } from './users.entity';
import { AuthGuard } from '../auth/auth.guard';
import { AddRoleDto } from './dto/add-role.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно создан',
    type: User,
  })
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Get('all')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 201,
    description: 'Список пользователей',
    type: [User],
  })
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно найден',
    type: User,
  })
  getUserById(@Param('id') id: number) {
    return this.usersService.getUserById(id);
  }

  @Post('addRole')
  @ApiBody({ type: AddRoleDto })
  @ApiResponse({
    status: 201,
    description: 'Пользователю успешно добавлена роль',
    type: User,
  })
  addRole(@Body() dto: AddRoleDto) {
    return this.usersService.addRole(dto);
  }
}
