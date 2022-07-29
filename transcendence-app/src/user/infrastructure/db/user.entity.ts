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
    public avatarId: string | null,
    public id: string,
    public createdAt: Date,
  ) {}
}
