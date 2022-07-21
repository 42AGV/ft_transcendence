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
  values: Array<string | null>;
}

export interface MappedQuery {
  cols: Array<string>;
  params: Array<string>;
  values: Array<string | null>;
}
