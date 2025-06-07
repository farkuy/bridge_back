import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiResponse } from '@nestjs/swagger';
import { Chat } from './chat.entity';

@Controller('chat')
export class ChatController {
  constructor(private chatsService: ChatService) {}

  @Get('all/:id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 201,
    description: 'Список доступных чатов',
    type: [Chat],
  })
  async getAllUserChats(@Param('id') id: number) {
    return await this.chatsService.getAllUserChats(id);
  }
}
