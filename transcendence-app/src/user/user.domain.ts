export class User {
  username!: string;
  email!: string;
  fullName!: string;
  avatarId!: string | null;
  avatarX: number = 0;
  avatarY: number = 0;
  id!: string;
  createdAt!: Date;
}
