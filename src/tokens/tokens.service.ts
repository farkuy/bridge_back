import { Injectable } from '@nestjs/common';
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

  private async hashToken(refreshToken: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(refreshToken, salt);
  }
}
