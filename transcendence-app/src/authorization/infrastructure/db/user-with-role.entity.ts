import { Role } from '../../../shared/enums/role.enum';

export interface UserWithRolesData {
  id: string;
  username: string;
  roles: Role[];
}
export class UserWithRoles {
  id: string;
  username: string;
  roles: Role[];
  constructor(userData: UserWithRolesData) {
    this.id = userData.id;
    this.username = userData.username;
    this.roles = [...userData.roles];
  }
}
