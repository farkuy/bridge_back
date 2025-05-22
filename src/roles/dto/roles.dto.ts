import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Уникальное значение роли, например: ADMIN, USER',
    example: 'ADMIN',
  })
  readonly value: string;

  @ApiProperty({
    description: 'Описание роли',
    example: 'Администратор с полными правами',
  })
  readonly description: string;
}
