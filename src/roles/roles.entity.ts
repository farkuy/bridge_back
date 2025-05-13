import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.entity';

@Entity()
export class Role {
  @ApiProperty({
    description: 'id роли',
    example: '1',
  })
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @ApiProperty({
    description: 'Значение роли',
    example: 'USER',
  })
  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  value: string;

  @ApiProperty({
    description: 'Описание роли',
    example: 'Обычный зарегистрированный пользователь',
  })
  @Column({ type: 'varchar', length: 255, nullable: false })
  description: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
