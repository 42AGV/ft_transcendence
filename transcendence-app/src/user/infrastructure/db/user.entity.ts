import { BaseEntity } from 'src/shared/db/models';

export enum userKeys {
  ID = 'id',
  USERNAME = 'username',
  EMAIL = 'email',
  AVATAR = 'avatar',
  TIMESTAMP = 'timestamp',
}

export class UserEntity implements BaseEntity {
  constructor(
    public username: string,
    public email: string,
    public avatar: string | null,
    public id: string,
    public created_at: number,
  ) {}
}
