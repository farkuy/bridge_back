import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/roles.entity';
import { RolesModule } from '../roles/roles.module';
import { UsersRepository } from './user.repository';
import { TokensModule } from '../tokens/tokens.module';
import { Chat } from '../chat/chat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Chat]),
    RolesModule,
    forwardRef(() => TokensModule),
  ],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
