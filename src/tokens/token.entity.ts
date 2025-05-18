import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.entity';

@Entity()
export class Token {
  @ApiProperty({
    description: 'id токена',
    example: '1',
  })
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @ApiProperty({
    description: 'Токен',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwSmqJp-QV30',
  })
  @Column({ type: 'varchar', unique: true, nullable: false })
  refreshToken: string;

  @OneToOne(() => User, (user) => user.refreshToken, { cascade: true })
  @JoinColumn()
  user: User;
}
