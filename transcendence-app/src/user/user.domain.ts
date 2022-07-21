export class User {
  constructor(
    public username: string,
    public email: string,
    public avatar_id: string | null,
    public id: string,
    public created_at: Date,
  ) {}
}
