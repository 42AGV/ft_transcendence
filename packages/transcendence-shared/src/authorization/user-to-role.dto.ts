import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
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
