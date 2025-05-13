import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/roles.dto';
import { Role } from './roles.entity';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}
  @Post('create')
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({
    status: 201,
    description: 'Роль успешно создана',
    type: Role,
  })
  createRole(@Body() dto: CreateRoleDto) {
    return this.rolesService.createRole(dto);
  }

  @Get(':value')
  @ApiResponse({
    status: 201,
    description: 'Получение данных о роли',
    type: Role,
  })
  getRoleByValue(@Param('value') value: string) {
    return this.rolesService.getRoleByValue(value);
  }
}
