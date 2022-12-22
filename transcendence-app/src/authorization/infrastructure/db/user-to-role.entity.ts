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
  id: string;
  role: Role;

  constructor(userRoleData: UserToRoleData) {
    this.id = userRoleData.id;
    this.role = userRoleData.role;
  }
}
