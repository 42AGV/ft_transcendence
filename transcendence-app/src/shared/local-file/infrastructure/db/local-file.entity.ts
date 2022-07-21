import { BaseEntity } from '../../../db/models';

export enum LocalFileKeys {
  ID = 'id',
  FILENAME = 'filename',
  PATH = 'path',
  MIMETYPE = 'mimetype',
  SIZE = 'size',
}

export class LocalFileEntity implements BaseEntity {
  constructor(
    public id: string,
    public filename: string,
    public path: string,
    public mimetype: string,
    public size: number,
  ) {}
}
