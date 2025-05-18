import { Role } from '../../roles/roles.entity';

export class CreateUserDto {
  readonly email: string;
  readonly password: string;
}

export class UserDto {
  readonly email: string;
  readonly id: number;
  readonly roles: Role[];
  readonly accessToken: string;
}
