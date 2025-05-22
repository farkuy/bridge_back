import { ApiProperty } from '@nestjs/swagger';

export class AddRoleDto {
  @ApiProperty({
    description: 'ID пользователя, которому добавляется роль',
    example: 42,
  })
  readonly userId: number;

  @ApiProperty({
    description: 'Значение роли, которую нужно добавить',
    example: 'ADMIN',
  })
  readonly value: string;
}
