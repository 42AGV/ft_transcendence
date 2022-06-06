export enum table {
  USERS = 'users',
}

export type ID = string | number;

export interface BaseEntity {
  id?: string;
}

export interface Query {
  text: string;
  values: Array<string>;
}

export interface MappedQuery {
  cols: Array<string>;
  params: Array<string>;
  values: Array<string>;
}
