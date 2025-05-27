import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokensRepository } from './tokens.repository';
import { User } from '../users/users.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TokensService {
  constructor(
    private tokensRepository: TokensRepository,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async generateTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { password, ...other } = user;
    const accessToken = this.jwtService.sign(other, { expiresIn: '2s' });
    const refreshToken = this.jwtService.sign(other, { expiresIn: '30d' });

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId: number, refreshToken: string) {
    const user = await this.usersService.getUserById(userId);
    const tokenData = await this.tokensRepository.findByUser(user);
    const refreshHash = await this.hashToken(refreshToken);

    if (tokenData) {
      tokenData.refreshToken = refreshHash;
      return this.tokensRepository.save(tokenData);
    }

    const token = this.tokensRepository.create({
      user,
      refreshToken: refreshHash,
    });
    return this.tokensRepository.save(token);
  }

  async updateToken(refreshToken: string, authorizationHeader?: string) {
    if (!authorizationHeader)
      throw new HttpException(
        'Нет заголовка авторизации',
        HttpStatus.FORBIDDEN,
      );

    const [Bearer, jwtToken] = authorizationHeader.split(' ');
    if (Bearer !== 'Bearer' || !jwtToken)
      throw new UnauthorizedException({
        message: 'Не авторизованный пользователь',
      });

    const user = await this.jwtService.decode(jwtToken);
    if (!user)
      throw new HttpException(
        'Не удалось получить метаданные пользователя',
        HttpStatus.FORBIDDEN,
      );

    const token = await this.tokensRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['user'],
    });
    if (!token)
      throw new HttpException(
        'Не найден токен пользователя',
        HttpStatus.FORBIDDEN,
      );

    const isValidToken = await bcrypt.compare(refreshToken, token.refreshToken);
    if (!isValidToken)
      throw new HttpException(
        'Токены не совпали. Авторизуйтесь еще раз.',
        HttpStatus.FORBIDDEN,
      );

    const tokens = await this.generateTokens(token.user);
    await this.saveToken(token.user.id, tokens.refreshToken);

    return tokens;
  }

  private async hashToken(refreshToken: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(refreshToken, salt);
  }
}
