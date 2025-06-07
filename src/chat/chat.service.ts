import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { CreateChatDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(private chatRepository: ChatRepository) {}

  async getAllUserChats(userId: number) {
    return await this.chatRepository.findAllUserChat(userId);
  }

  async getChat(userId: number, anotherUserId: number) {
    return await this.chatRepository.findUsersChat(userId, anotherUserId);
  }

  async createChat(chatDto: CreateChatDto) {
    return await this.chatRepository.createUsersChat(chatDto);
  }
}
