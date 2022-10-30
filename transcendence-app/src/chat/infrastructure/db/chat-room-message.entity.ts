export enum ChatRoomMessageKeys {
  ID = '"id"',
  USER_ID = '"userId"',
  CHAT_ROOM_ID = '"chatId"',
  CONTENT = '"content"',
  CREATED_AT = '"createdAt"',
}

export interface ChatRoomMessageEntityData {
  id: string;
  chatId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export class ChatRoomMessageEntity {
  id!: string;
  chatId!: string;
  userId!: string;
  content!: string;
  createdAt!: Date;

  constructor(data: ChatRoomMessageEntityData) {
    this.id = data.id;
    this.userId = data.userId;
    this.chatId = data.chatId;
    this.content = data.content;
    this.createdAt = data.createdAt;
  }
}
