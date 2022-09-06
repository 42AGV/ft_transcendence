import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/shared/db/models';

export enum userKeys {
  ID = '"id"',
  USERNAME = '"username"',
  EMAIL = '"email"',
  FULL_NAME = '"fullName"',
  PASSWORD = '"password"',
  AVATAR_ID = '"avatarId"',
  CREATED_AT = '"createdAt"',
  AVATAR_X = '"avatarX"',
  AVATAR_Y = '"avatarY"',
}

export class UserEntity implements BaseEntity {
  username!: string;
  email!: string;
  fullName!: string;
  @Exclude()
  password!: string | null;
  avatarId!: string | null;
  avatarX!: number;
  avatarY!: number;
  id!: string;
  createdAt!: Date;
}
