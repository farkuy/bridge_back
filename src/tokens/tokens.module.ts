import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { UsersModule } from '../users/users.module';
import { TokensRepository } from './tokens.repository';

@Module({
  providers: [TokensService, TokensRepository],
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
    }),
    UsersModule,
  ],
  exports: [TokensService],
})
export class TokensModule {}
