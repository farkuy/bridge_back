import { Injectable } from '@nestjs/common';
import { TokensRepository } from './tokens.repository';
import { User } from '../users/users.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokensService {
  constructor(
    private tokensRepository: TokensRepository,
    private jwtService: JwtService,
  ) {}

  async generateTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { password, ...other } = user;
    const accessToken = this.jwtService.sign(other);
    const refreshToken = this.jwtService.sign(other);

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId: number, refreshToken: string) {
    const tokenData = await this.tokensRepository.findByUserId(userId);
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return this.tokensRepository.save(tokenData);
    }

    const token = this.tokensRepository.create({ user: userId, refreshToken });
    return token;
  }
}
