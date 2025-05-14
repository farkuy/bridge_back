import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/roles.entity';
import { RolesModule } from '../roles/roles.module';
import { UsersRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), RolesModule],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
