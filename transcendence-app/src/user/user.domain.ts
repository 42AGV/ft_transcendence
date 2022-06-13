export class User {
  constructor(
    public username: string,
    public email: string,
    public avatar: string | null,
    public id: string,
    public created_at: number,
  ) {}
}
