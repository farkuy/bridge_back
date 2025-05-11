import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/user.dto';
import { User } from '../users/users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registration(createUserDto: CreateUserDto) {
    const user = await this.usersService.getUserByEmail(createUserDto.email);
    if (user)
      throw new HttpException(
        'Пользователь с такой почтной уже зарегестрирован',
        HttpStatus.FORBIDDEN,
      );

    const secretPassword = await this.hashPassword(createUserDto.password);

    const newUser = await this.usersService.createUser({
      ...createUserDto,
      password: secretPassword,
    });

    return await this.generateToken(newUser);
  }

  async login(loginUserDto: CreateUserDto) {
    const user = await this.usersService.getUserByEmail(loginUserDto.email);
    if (!user)
      throw new HttpException(
        'Пользователь с такой почтной не найден',
        HttpStatus.FORBIDDEN,
      );

    const checkPassword = await this.comparePassword(
      loginUserDto.password,
      user.password,
    );
    if (!checkPassword)
      throw new HttpException('Не верный пароль', HttpStatus.FORBIDDEN);

    return await this.generateToken(user);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
  private async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  private async generateToken(user: User): Promise<{ access_token: string }> {
    const { password, ...other } = user;
    return {
      access_token: await this.jwtService.signAsync(other),
    };
  }
}
