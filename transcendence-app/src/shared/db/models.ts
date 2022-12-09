export enum table {
  USERS = 'Users',
  LOCAL_FILE = 'LocalFile',
  AUTH_PROVIDER = 'AuthProvider',
  BLOCK = 'Block',
  CHAT_MESSAGE = 'ChatMessage',
  CHATROOM = 'Chatroom',
  CHATROOM_MEMBERS = 'ChatroomMembers',
  CHATROOM_MESSAGE = 'ChatroomMessage',
  FRIEND = 'Friend',
}

export interface Query {
  text: string;
  values: any[];
}

export interface MappedQuery {
  cols: string[];
  params: string[];
  values: any[];
}
