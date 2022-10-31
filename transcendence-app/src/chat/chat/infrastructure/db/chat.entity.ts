export enum chatKeys {
  ID = '"id"',
  USER_1_ID = '"user1Id"',
  USER_2_ID = '"user2Id"',
}

export class ChatEntity {
  constructor(
    public id: string,
    public userId1: string,
    public userId2: string,
  ) {}
}
