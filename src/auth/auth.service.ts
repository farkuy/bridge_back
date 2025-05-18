import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto, UserDto } from '../users/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokensService,
  ) {}

  async registration(createUserDto: CreateUserDto): Promise<UserDto> {
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

    const tokens = await this.tokenService.generateTokens(newUser);
    await this.tokenService.saveToken(newUser.id, tokens.refreshToken);
    return {
      ...newUser,
      ...tokens,
    };
  }

  async login(loginUserDto: CreateUserDto): Promise<UserDto> {
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

    const tokens = await this.tokenService.generateTokens(user);
    await this.tokenService.saveToken(user.id, tokens.refreshToken);
    return {
      ...user,
      ...tokens,
    };
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
}
