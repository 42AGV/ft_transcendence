export enum ChatRoomMessageKeys {
  ID = '"id"',
  USER_ID = '"userId"',
  CHAT_ROOM_ID = '"chatRoomId"',
  CONTENT = '"content"',
  CREATED_AT = '"createdAt"',
}

export interface ChatroomMessageEntityData {
  id: string;
  chatId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export class ChatroomMessageEntity {
  id!: string;
  chatId!: string;
  userId!: string;
  content!: string;
  createdAt!: Date;

  constructor(data: ChatroomMessageEntityData) {
    this.id = data.id;
    this.userId = data.userId;
    this.chatId = data.chatId;
    this.content = data.content;
    this.createdAt = data.createdAt;
  }
}
