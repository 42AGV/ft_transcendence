import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Role } from '../../../shared/enums/role.enum';

export enum UserToRoleKeys {
  ID = '"id"',
  ROLE = '"role"',
}

export interface UserToRoleData {
  id: string;
  role: Role;
}

export class UserToRole {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role!: Role;

  constructor(userRoleData?: UserToRoleData) {
    if (userRoleData !== undefined) {
      this.id = userRoleData.id;
      this.role = userRoleData.role;
    }
  }
}
