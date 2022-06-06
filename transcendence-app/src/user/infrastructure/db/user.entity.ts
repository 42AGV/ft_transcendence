import { BaseEntity } from 'src/shared/db/models';

export enum userKeys {
  ID = 'id',
  USERNAME = 'username',
  EMAIL = 'email',
  AVATAR = 'avatar',
  TIMESTAMP = 'timestamp',
}
export class UserEntity implements BaseEntity {
  username: string;
  email: string;
  avatar?: string | null;
  id?: string;
  created_at?: number;

  constructor(
    username: string,
    email: string,
    avatar?: string | null,
    id?: string,
    created_at?: number,
  ) {
    this.username = username;
    this.email = email;
    this.avatar = avatar;
    this.id = id;
    this.created_at = created_at;
  }
}
