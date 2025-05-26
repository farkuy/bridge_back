import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/user.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('registration')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Пользователь зарегестрирован',
    type: UserResponseDto,
  })
  async registration(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...other } = await this.authService.registration(dto);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    console.log(other);

    return plainToInstance(UserResponseDto, other, {
      excludeExtraneousValues: true,
    });
  }

  @Post('login')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зашел',
    type: UserResponseDto,
  })
  async login(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response<UserResponseDto>,
  ) {
    const { refreshToken, ...other } = await this.authService.login(dto);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return plainToInstance(UserResponseDto, other, {
      excludeExtraneousValues: true,
    });
  }
}
