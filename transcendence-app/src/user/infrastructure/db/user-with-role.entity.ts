import { User, UserData } from './user.entity';
import { Role } from '../../../shared/enums/roles.enum';

export interface UserWithRolesData extends UserData {
  roles: Role[] | null;
}
export class UserWithRoles extends User {
  roles: Role[];
  constructor(userData: UserWithRolesData) {
    super(userData);
    this.roles = userData.roles ? [...userData.roles] : [Role.none];
  }
}
