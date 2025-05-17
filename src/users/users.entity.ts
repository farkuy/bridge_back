import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../roles/roles.entity';
import { Token } from '../tokens/token.entity';

@Entity()
export class User {
  @ApiProperty({
    description: 'id пользователя',
    example: '1',
  })
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @ApiProperty({
    description: 'Почта пользователя',
    example: 'user@example.com',
  })
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: '1234',
  })
  @Column({ type: 'varchar', length: 255, nullable: false })
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
  @Column({ type: 'varchar', length: 500, nullable: true })
  banReason: string;

  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable()
  roles: Role[];

  @OneToOne(() => Token, (tokens) => tokens.user)
  refreshToken: Token;
}
