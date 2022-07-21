import { BaseEntity } from 'src/shared/db/models';

export enum userKeys {
  ID = 'id',
  USERNAME = 'username',
  EMAIL = 'email',
  AVATAR_ID = 'avatar_id',
  CREATED_AT = 'created_at',
}

export class UserEntity implements BaseEntity {
  constructor(
    public username: string,
    public email: string,
    public avatar_id: string | null,
    public id: string,
    public created_at: Date,
  ) {}
}
