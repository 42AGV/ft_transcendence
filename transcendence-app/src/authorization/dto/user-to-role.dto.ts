import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { Role } from '../../shared/enums/role.enum';
import { UserToRoleData } from '../infrastructure/db/user-to-role.entity';
export class UserToRoleDto implements UserToRoleData {
  @IsUUID()
  id!: string;

  @IsEnum(Role)
  role!: Role;

  @IsOptional()
  username?: string;
}
