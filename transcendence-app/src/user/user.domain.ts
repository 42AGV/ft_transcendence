export class User {
  username: string;
  email: string;
  avatar: string | null;
  id: string;
  createdAt: Date;

  constructor(
    username: string,
    email: string,
    avatar: string | null,
    id: string,
    createdAt: Date,
  ) {
    this.username = username;
    this.email = email;
    this.avatar = avatar;
    this.id = id;
    this.createdAt = createdAt;
  }
}
