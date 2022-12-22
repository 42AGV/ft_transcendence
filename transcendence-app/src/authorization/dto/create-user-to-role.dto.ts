import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Role } from '../../shared/enums/role.enum';
import { UserToRoleData } from '../infrastructure/db/user-to-role.entity';

export class CreateUserToRoleDto implements UserToRoleData {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role!: Role;
}
