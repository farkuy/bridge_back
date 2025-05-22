import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/roles.entity';

export class UserResponseDto {
  @ApiProperty({
    description: 'Уникальный идентификатор пользователя',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'Список ролей пользователя',
    type: [Role],
  })
  @Expose()
  readonly roles: Role[];

  @ApiProperty({
    description: 'Токен доступа для авторизации пользователя',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Expose()
  readonly accessToken: string;
}
