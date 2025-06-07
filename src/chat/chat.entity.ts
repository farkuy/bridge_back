import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.entity';

@Entity()
export class Chat {
  @ApiProperty({
    description: 'id чата',
    example: '1',
  })
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @ManyToMany(() => User, (user) => user.chats)
  users: User[];
}
