/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Exclude } from 'class-transformer';
import { UserEntity } from './infrastructure/db/user.entity';

export class User {
  username!: string;
  email!: string;
  fullName!: string;
  @Exclude()
  password!: string | null;
  avatarId!: string | null;
  avatarX: number = 0;
  avatarY: number = 0;
  id!: string;
  createdAt!: Date;

  constructor(entity: UserEntity) {
    Object.assign(this, entity);
  }
}
