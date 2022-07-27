export enum table {
  USERS = 'users',
  LOCAL_FILE = 'local_file',
}

export type ID = string | number;

export interface BaseEntity {
  id?: string;
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
