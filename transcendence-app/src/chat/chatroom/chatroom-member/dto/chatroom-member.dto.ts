/* eslint-disable @typescript-eslint/no-inferrable-types */
export class ChatroomMemberAsUserResponseDto {
  username!: string;
  avatarId!: string;
  avatarX: number = 0;
  avatarY: number = 0;

  constructor(user: ChatroomMemberAsUserResponseDto) {
    Object.assign(this, user);
  }
}
