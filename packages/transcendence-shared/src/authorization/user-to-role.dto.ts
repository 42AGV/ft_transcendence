import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { Role } from '../shared/enums/role.enum';

export class UserToRoleDto {
  @IsUUID()
  id!: string;

  @IsEnum(Role)
  role!: Role;

  @IsOptional()
  username?: string;
}
