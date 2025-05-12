import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { User } from './users.entity';
import { AuthGuard } from '../auth/auth.guard';

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

  @Get()
  @ApiQuery({
    name: 'email',
    type: String,
    description: 'Email пользователя',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно найден',
    type: User,
  })
  getUserByEmail(@Body() email: string) {
    return this.usersService.getUserByEmail(email);
  }
}
