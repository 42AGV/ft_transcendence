export enum ChatroomMessageKeys {
  ID = '"id"',
  SUCCESSION = 'succession',
  USER_ID = '"userId"',
  CHATROOM_ID = '"chatroomId"',
  CONTENT = '"content"',
  CREATED_AT = '"createdAt"',
}

export interface ChatroomMessageData {
  id: string;
  succession: string;
  chatroomId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export class ChatroomMessage {
  id: string;
  succession: string;
  chatroomId: string;
  userId: string;
  content: string;
  createdAt: Date;

  constructor(data: ChatroomMessageData) {
    this.id = data.id;
    this.succession = data.succession;
    this.userId = data.userId;
    this.chatroomId = data.chatroomId;
    this.content = data.content;
    this.createdAt = data.createdAt;
  }
}
