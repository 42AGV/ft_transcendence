export class User {
  username: string;
  email: string;
  avatar_id: string | null;
  id: string;
  created_at: Date;

  constructor(
    username: string,
    email: string,
    avatar_id: string | null,
    id: string,
    created_at: Date,
  ) {
    this.username = username;
    this.email = email;
    this.avatar_id = avatar_id;
    this.id = id;
    this.created_at = created_at;
  }
}
