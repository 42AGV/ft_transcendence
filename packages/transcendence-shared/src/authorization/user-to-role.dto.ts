import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { Role } from '../shared/enums/role.enum';

export class UserToRoleDto {
  @IsUUID()
  id!: string;

  @IsEnum(Role)
  role!: Role;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  username?: string;
}
