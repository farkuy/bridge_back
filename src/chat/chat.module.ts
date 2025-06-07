import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { Chat } from './chat.entity';
import { ChatService } from './chat.service';
import { ChatRepository } from './chat.repository';
import { ChatController } from './chat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Chat])],
  providers: [ChatService, ChatRepository],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
