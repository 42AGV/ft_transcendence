import { User, UserData } from './user.entity';
import { Role } from '../../../shared/enums/role.enum';

export interface UserWithRolesData extends UserData {
  roles: Role[];
}
export class UserWithRoles extends User {
  roles: Role[];
  constructor(userData: UserWithRolesData) {
    super(userData);
    this.roles = [...userData.roles];
  }
}
