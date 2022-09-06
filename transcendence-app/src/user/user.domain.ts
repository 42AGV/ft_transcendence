import { Exclude } from 'class-transformer';

export class User {
  username!: string;
  email!: string;
  fullName!: string;
  @Exclude()
  password!: string | null;
  avatarId!: string | null;
  avatarX = 0;
  avatarY = 0;
  id!: string;
  createdAt!: Date;
}
