import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private tokensService: TokensService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
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
      if (error instanceof TokenExpiredError) {
      }
      throw new UnauthorizedException({
        message: 'Не авторизованный пользователь',
      });
    }
  }
}
