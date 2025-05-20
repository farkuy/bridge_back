import { Expose } from 'class-transformer';
import { Role } from '../../roles/roles.entity';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  readonly roles: Role[];
  @Expose()
  readonly accessToken: string;
}
