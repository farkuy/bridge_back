import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({
    description: 'массив id пользователей',
    example: [1, 666],
  })
  readonly usersId: number[];
}
