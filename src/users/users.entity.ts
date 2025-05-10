import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({
    description: 'id пользователя',
    example: '1',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Почта пользователя',
    example: 'user@example.com',
  })
  @Column({ type: 'string', unique: true, nullable: false })
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: '1234',
  })
  @Column({ type: 'string', nullable: false })
  password: string;

  @ApiProperty({
    description: 'Статус бана пользователя',
    example: false,
  })
  @Column({ type: 'boolean', default: false })
  isBan: boolean;

  @ApiProperty({
    description: 'Причина бана пользователя',
    example: 'Нарушение правил',
    required: false,
  })
  @Column({ type: 'string', nullable: true })
  banReason: string;
}
