export enum table {
  USERS = 'Users',
  LOCAL_FILE = 'LocalFile',
  AUTH_PROVIDER = 'AuthProvider',
  BLOCK = 'Block',
  CHATROOM = 'Chatroom',
  CHATROOM_MEMBERS = 'ChatroomMembers',
  CHATROOM_MESSAGE = 'ChatroomMessage',
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
