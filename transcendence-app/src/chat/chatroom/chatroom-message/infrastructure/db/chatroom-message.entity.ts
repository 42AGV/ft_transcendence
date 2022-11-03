export enum ChatroomMessageKeys {
  ID = '"id"',
  USER_ID = '"userId"',
  CHATROOM_ID = '"chatroomId"',
  CONTENT = '"content"',
  CREATED_AT = '"createdAt"',
}

export interface ChatroomMessageEntityData {
  id: string;
  chatroomId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export class ChatroomMessageEntity {
  id!: string;
  chatroomId!: string;
  userId!: string;
  content!: string;
  createdAt!: Date;

  constructor(data: ChatroomMessageEntityData) {
    this.id = data.id;
    this.userId = data.userId;
    this.chatroomId = data.chatroomId;
    this.content = data.content;
    this.createdAt = data.createdAt;
  }
}
