import { Role } from '../../../shared/enums/roles.enum';

export enum userToRoleKeys {
  ID = '"id"',
  ROLE = '"role"',
}

interface UserToRoleData {
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
