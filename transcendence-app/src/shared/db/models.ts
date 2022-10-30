export enum table {
  USERS = 'Users',
  LOCAL_FILE = 'LocalFile',
  AUTH_PROVIDER = 'AuthProvider',
  BLOCK = 'Block',
  CHATS = 'ChatRoom',
  CHATMEMBERS = 'ChatRoomMembers',
  CHAT_ROOM_MESSAGE = 'ChatRoomMessage',
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
