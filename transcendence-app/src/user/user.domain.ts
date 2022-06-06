export class User {
  username: string;
  email: string;
  avatar?: string | null;
  constructor(username: string, email: string, avatar: string) {
    this.username = username;
    this.email = email;
    this.avatar = avatar;
  }
}
