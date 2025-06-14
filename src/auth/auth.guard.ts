import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
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
      throw new UnauthorizedException({
        message: 'окен невалиден или истёк',
      });
    }
  }
}
