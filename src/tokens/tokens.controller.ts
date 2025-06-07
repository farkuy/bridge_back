import { Controller, Post, Req, Res } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { TokensService } from './tokens.service';
import { TokenDto } from './dto/token.dto';

@Controller('tokens')
export class TokensController {
  constructor(private tokensService: TokensService) {}

  @Post('update')
  @ApiResponse({
    status: 201,
    description: 'Токены обновлены',
    type: TokenDto,
  })
  async update(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const authorizationHeader = req.headers.authorization;
    const refreshTokenCookie = req.cookies['refreshToken'];

    const { refreshToken, accessToken } = await this.tokensService.updateToken(
      refreshTokenCookie,
      authorizationHeader,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { accessToken: accessToken };
  }
}
