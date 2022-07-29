export class User {
  username: string;
  email: string;
  avatarId: string | null;
  id: string;
  createdAt: Date;

  constructor(
    username: string,
    email: string,
    avatarId: string | null,
    id: string,
    createdAt: Date,
  ) {
    this.username = username;
    this.email = email;
    this.avatarId = avatarId;
    this.id = id;
    this.createdAt = createdAt;
  }
}
