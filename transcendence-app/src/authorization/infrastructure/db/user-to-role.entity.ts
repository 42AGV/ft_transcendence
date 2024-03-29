import { Role } from 'transcendence-shared';

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
