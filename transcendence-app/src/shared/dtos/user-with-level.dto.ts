import { User, UserData } from '../../user/infrastructure/db/user.entity';

export interface UserWithLevelData extends UserData {
  level: number;
}

export class UserWithLevelDto extends User {
  level: number;
  constructor({ level, ...rest }: UserWithLevelData) {
    super(rest);
    this.level = level;
  }
}
