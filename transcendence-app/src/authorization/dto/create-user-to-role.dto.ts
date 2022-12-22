import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Role } from '../../shared/enums/role.enum';

export class CreateUserToRoleDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role!: Role;
}
