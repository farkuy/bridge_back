import {
  Column,
  Entity,
  JoinTable,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.entity';

@Entity()
export class Token {
  @ApiProperty({
    description: 'id',
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
  @JoinTable()
  user: User;
}
