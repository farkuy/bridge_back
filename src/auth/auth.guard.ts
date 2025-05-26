import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { TokensService } from '../tokens/tokens.service';
import { response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private tokensService: TokensService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader)
      throw new HttpException(
        'Нет заголовка авторизации',
        HttpStatus.FORBIDDEN,
      );

    const [Bearer, token] = authorizationHeader.split(' ');
    if (Bearer !== 'Bearer' || !token)
      throw new UnauthorizedException({
        message: 'Не авторизованный пользователь',
      });

    try {
      request.user = this.jwtService.verify(token);
      return true;
    } catch (error) {
      const refreshToken = request.cookies['refreshToken'];

      const userInfo = this.jwtService.decode(token);
      if (!userInfo)
        throw new HttpException(
          'Не удалось получить метаданные пользователя',
          HttpStatus.FORBIDDEN,
        );

      if (error instanceof TokenExpiredError) {
        const tokens = await this.tokensService.updateToken(
          userInfo.id,
          refreshToken,
        );

        response.cookie('refreshToken', tokens.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        response.setHeader('Authorization', `Bearer ${tokens.accessToken}`);
      }

      throw new UnauthorizedException({
        message: 'Не авторизованный пользователь',
      });
    }
  }
}
