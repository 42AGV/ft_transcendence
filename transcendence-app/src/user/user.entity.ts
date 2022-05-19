import { ValidateNested } from 'class-validator';
import { UserDto } from './dto/user.dto';
import { Constants } from '../shared/enums/commonconsts.enum';
// import { Entity } from '../db/db';

// @Entity()
export class UserEntity {
  private static lastUserId = Constants.UserIdStart;

  constructor(user: UserDto) {
    this.Dto = user;
    this.id = UserEntity.lastUserId++;
    // this.isActive = true;
  }

  // @PrimaryGeneratedColumn()
  id: number;

  // @Column({ default: true })
  // isActive: boolean;

  @ValidateNested()
  Dto: UserDto;
}
