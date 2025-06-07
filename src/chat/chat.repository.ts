import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { CreateChatDto } from './dto/chat.dto';

@Injectable()
export class ChatRepository extends Repository<Chat> {
  constructor(private dataSource: DataSource) {
    super(Chat, dataSource.createEntityManager());
  }

  async findUsersChat(userId: number, anotherUserId: number) {
    return await this.createQueryBuilder('chat')
      .innerJoin('chat.users', 'user1', 'user1.id = :userId', { userId })
      .innerJoin('chat.users', 'user2', 'user2.id = :anotherUserId', {
        anotherUserId,
      })
      .getOne();
  }

  async findAllUserChat(userId: number) {
    return await this.find({ where: { users: { id: userId } } });
  }

  async createUsersChat(chatDto: CreateChatDto) {
    const chat = this.create({
      users: chatDto.usersId.map((id) => ({ id })),
    });
    return this.save(chat);
  }
}
