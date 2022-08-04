export enum table {
  USERS = 'Users',
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
