import { IsInt, IsPositive, ValidateNested } from 'class-validator';
import { UserDto } from './dto/user.dto';
import { Constants } from '../shared/enums/commonconsts.enum';

export class UserEntity {
  private static lastUserId = Constants.UserIdStart;

  constructor(user: UserDto) {
    this.Dto = user;
    this.id = UserEntity.lastUserId++;
  }

  @IsPositive()
  @IsInt()
  id: number;

  @ValidateNested()
  Dto: UserDto;
}
