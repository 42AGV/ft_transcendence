import { Role } from '../shared/enums/role.enum';

export class UserToRoleDto {
  id!: string;

  role!: Role;

  username?: string;
}
