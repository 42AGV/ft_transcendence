export class ChatmemberAsUserResponseDto {
  username!: string;
  avatarId!: string | null;
  avatarX: number = 0;
  avatarY: number = 0;

  constructor(user: ChatmemberAsUserResponseDto) {
    Object.assign(this, user);
  }
}
