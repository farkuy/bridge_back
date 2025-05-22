import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email пользователя, используемый для входа',
    example: 'user@example.com',
  })
  readonly email: string;

  @ApiProperty({
    description: 'Пароль пользователя (рекомендуется минимум 8 символов)',
    example: 'strongPassword123',
  })
  readonly password: string;
}
